import * as React from "react";
import {Fragment, useContext, useEffect, useState} from "react";
import {CButton, CCol, CForm, CFormInput, CFormSelect, CRow} from "@coreui/react";
import {authenticate, getDatabaseInfo, predict, setEnvironment} from "jai-sdk";
import {DatabaseInfo} from "jai-sdk/dist/tsc/collection-management/database-info/types";
import {AuthenticationContext} from "../../../../hoc/AuthenticationContext";
import {extractCollectionRange, implementNumberedRangeOnSelection} from "../../../../services/excel-range-filtering";

function Prediction() {

    const {apiKey, environmentName} = useContext(AuthenticationContext);

    const [apiError, setApiError] = useState("");
    const [collectionError, setCollectionError] = useState("");
    const [databaseInfo, setDatabaseInfo] = useState([]);

    const [selectedCollection, setSelectedCollection] = useState("");
    const [selectedTopK, setSelectedTopK] = useState(5);

    const [selectedInputRange, setSelectedInputRange] = useState("Sheet1!E1:F2");
    const [selectedInputWorksheet, setSelectedInputWorksheet] = useState("Sheet1");

    const [selectedOutputRange, setSelectedOutputRange] = useState("Sheet1!A1");

    useEffect(() => {

        authenticate(apiKey);
        setEnvironment(environmentName);

        getDatabaseInfo("complete").then(
            (data: DatabaseInfo[]) => {
                setDatabaseInfo(data);
            },
            (e) => setApiError(e.message)
        );
    }, [apiKey, environmentName]);

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            setApiError("");
        } catch (error) {
            setApiError(error.message);
        }
    };

    const collectionItems = () => {

        const mapped = databaseInfo
            .filter(x => x.db_type !== "RecommendationSystem")
            .filter(x => x.db_type !== "Recommendation")
            .map(({db_name}) => db_name)
            .sort();

        return [
            "Select...",
            ...mapped
        ];
    };

    const collectionSelected = () => !!selectedCollection;

    const lockInputRange = async () => {
        setCollectionError("");

        await Excel.run(async (context) => {
            const range = context.workbook.getSelectedRange();

            range.load(["address", "worksheet"]);

            await context.sync();

            try {
                const rangeString = range.address.toString();

                const filtered = implementNumberedRangeOnSelection(rangeString);

                setSelectedInputRange(filtered);
                setSelectedInputWorksheet(range.worksheet.name);
            } catch (e) {
                console.log(e);
            }
        });
    };

    const lockOutputRange = async () => {
        setCollectionError("")

        await Excel.run(async (context) => {
            let range = context.workbook.getSelectedRange();

            range.load(["address", "worksheet"]);

            await context.sync();

            const rangeString = range.address.toString();

            const filtered = implementNumberedRangeOnSelection(rangeString);

            setSelectedOutputRange(filtered);
        });
    };

    const validToRunReport = () => {
        return selectedOutputRange && selectedInputRange;
    };

    interface criteria {
        [name: string]: string
    }

    const run = async () => {
        setCollectionError("");

        await Excel.run(async (context) => {

            try {

                const workbook = context.workbook.worksheets.getItem(selectedInputWorksheet);

                const range = workbook.getRange(selectedInputRange);
                range.load("values");
                await context.sync();

                const {values} = range;

                let map: { [key: string]: boolean } = {};

                for (let i = 0; i < values.length; i++) {
                    const x = values[i];
                    map[`"${x[0]}"`] = x[1];
                }

                let array = [{...map}];

                const result = await predict(selectedCollection, array);
                debugger
                if (!result.recommendation) {
                    return;
                }
                const output = [];
                const header = [`source "${selectedCollection}" id`, `predict`, "distance"]
                output.push(header);

                for (const {query_id, results} of result.similarity) {
                    const {id: sourceId} = results[0];
                    for (let i = 1; i < results.length; i++) {
                        const {id, distance} = results[i];

                        output.push([sourceId, id, distance]);
                    }
                }

                let collectionRange = extractCollectionRange(selectedOutputRange, header.length, output.length);

                workbook.getRange(collectionRange).values = output;
                await context.sync();
            } catch (e) {
                console.error(e);
                setCollectionError("Error getting output results.")
            }
        });
    };

    return (
        <div>
            <CForm className={"p-3"} onSubmit={handleSubmit}>
                <CRow>
                    <CCol xs={{span: 12}} sm={{span: 12}}>
                        <CFormSelect
                            onChange={e => setSelectedCollection(e.target.value)}
                            options={collectionItems()}
                            label={databaseInfo.length == 0 ? "Please wait, loading..." : "Choose a model"}
                        />
                        {apiError && <div className={"error-message"}>{apiError}</div>}
                    </CCol>
                </CRow>

                {collectionSelected() && (
                    <Fragment>
                        <CRow>
                            <CCol xs={{span: 8}} sm={{span: 10}}>
                                <CFormInput
                                    required
                                    className={"mb-1"}
                                    label="Select the input it range and click in 'Lock Range'"
                                    value={selectedInputRange}
                                />
                            </CCol>
                            <CCol xs={{span: 10}} sm={{span: 2}} className="d-flex flex-column">
                                <CButton className="lock-button" color="dark" onClick={() => lockInputRange()}>
                                    Lock
                                </CButton>
                            </CCol>
                        </CRow>

                        <CRow>
                            <CCol xs={{span: 10}} sm={{span: 10}}>
                                <CFormInput
                                    required
                                    className={"mb-1"}
                                    label="Select the output range and click in 'Lock Range'"
                                    value={selectedOutputRange}
                                />
                            </CCol>
                            <CCol xs={{span: 2}} sm={{span: 2}} className="d-flex flex-column">
                                <CButton className="lock-button" color="dark" onClick={() => lockOutputRange()}>
                                    Lock
                                </CButton>
                            </CCol>
                        </CRow>
                        {collectionError && <div className={"error-message"}>{collectionError}</div>}
                        <CCol md={12}>
                            <CButton color="success" disabled={!validToRunReport()} onClick={() => run()}>
                                Predict
                            </CButton>
                        </CCol>

                    </Fragment>
                )}
            </CForm>

        </div>
    );
}

export default Prediction;
