import * as React from "react";
import {Fragment, useContext, useEffect, useState} from "react";
import {CButton, CCol, CForm, CFormInput, CFormSelect, CRow} from "@coreui/react";
import {authenticate, getDatabaseInfo, predict, setEnvironment} from "jai-sdk";
import {DatabaseInfo} from "jai-sdk/dist/tsc/collection-management/database-info/types";
import {AuthenticationContext} from "../../../../hoc/AuthenticationContext";
import {extractCollectionRange, implementNumberedRangeOnSelection} from "../../../../services/excel-range-filtering";
import Puff from "react-loading-icons/dist/esm/components/puff";

function Prediction() {

    const {apiKey, environmentName} = useContext(AuthenticationContext);

    const [apiError, setApiError] = useState("");
    const [collectionError, setCollectionError] = useState("");
    const [databaseInfo, setDatabaseInfo] = useState([]);

    const [selectedCollection, setSelectedCollection] = useState("");
    const [loading, setLoading] = useState(false);

    const [selectedInputRange, setSelectedInputRange] = useState("");
    const [selectedInputWorksheet, setSelectedInputWorksheet] = useState("");

    const [selectedOutputRange, setSelectedOutputRange] = useState("");

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


    const sourceQueryLabel = () => {
        if (databaseInfo.length == 0)
            return (
                <div>
                    Please wait, loading...<Puff className={"label-spin-loading"} stroke="#f95f18"/>
                </div>
            );

        return (
            <div>
                Select a model
            </div>
        );
    };

    const run = async () => {
        setLoading(true);
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
                console.log(array)
                const result = await predict(selectedCollection, array);
                debugger
                if (!result) {
                    return;
                }
                const output = [];
                const header = [`source "${selectedCollection}" id`, `predict`, "distance"]
                output.push(header);

                for (const {query_id, results} of result.similarity) {
                    for (let i = 1; i < results.length; i++) {
                        const {id, distance} = results[i];

                        output.push([query_id, id, distance]);
                    }
                }

                let collectionRange = extractCollectionRange(selectedOutputRange, header.length, output.length);

                workbook.getRange(collectionRange).values = output;
                await context.sync();
            } catch (e) {
                console.error(e);
                setCollectionError("Error getting output results.")
            } finally {
                setLoading(false);
            }
        });
    };

    const runLabel = () => {
        if (loading)
            return (
                <div>
                    Loading <Puff className={"button-spin-loading"} stroke="#ffffff"/>
                </div>
            );

        return (
            <div>
                Predict
            </div>
        );
    };

    return (
        <div>
            <CForm className={"p-3"} onSubmit={handleSubmit}>
                <CRow>
                    <CCol xs={{span: 12}} sm={{span: 12}}>
                        <CFormSelect
                            onChange={e => setSelectedCollection(e.target.value)}
                            options={collectionItems()}
                            label={sourceQueryLabel()}
                        />
                        {apiError && <div className={"error-message"}>{apiError}</div>}
                    </CCol>
                </CRow>

                {collectionSelected() && (
                    <Fragment>
                        <CRow>
                            <CCol xs={{span: 10}} sm={{span: 10}}>
                                <CFormInput
                                    required
                                    className={"mb-1"}
                                    label="Select the input it range and click in 'Lock Range'"
                                    value={selectedInputRange}
                                />
                            </CCol>
                            <CCol xs={{span: 2}} sm={{span: 2}} className="d-flex flex-column">
                                <CButton className="lock-button" onClick={() => lockInputRange()}>
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
                                <CButton className="lock-button" onClick={() => lockOutputRange()}>
                                    Lock
                                </CButton>
                            </CCol>
                        </CRow>
                        {collectionError && <div className={"error-message"}>{collectionError}</div>}
                        <CCol md={12}>
                            <CButton className={"mt-10 run-button w-100"} disabled={!validToRunReport()}
                                     onClick={() => run()}>
                                {runLabel()}
                            </CButton>
                        </CCol>

                    </Fragment>
                )}
            </CForm>

        </div>
    );
}

export default Prediction;
