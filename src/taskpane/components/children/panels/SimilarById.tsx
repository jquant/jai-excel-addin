import * as React from "react";
import {Fragment, useContext, useEffect, useState} from "react";
import {CButton, CCol, CForm, CFormInput, CFormSelect, CRow} from "@coreui/react";
import {authenticate, getDatabaseInfo, setEnvironment, similaritySearchById} from "jai-sdk";
import {DatabaseInfo} from "jai-sdk/dist/tsc/collection-management/database-info/types";
import {AuthenticationContext} from "../../../../hoc/AuthenticationContext";
import {topKOptions} from "../../../../constants/listing/topk";
import {extractCollectionRange, implementNumberedRangeOnSelection} from "../../../../services/excel-range-filtering";

function SimilarById() {

    const {apiKey, environmentName} = useContext(AuthenticationContext);

    const [apiError, setApiError] = useState("");
    const [collectionError, setCollectionError] = useState("");
    const [databaseInfo, setDatabaseInfo] = useState([]);

    const [selectedCollection, setSelectedCollection] = useState("");
    const [selectedTopK, setSelectedTopK] = useState(5);

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

    const run = async () => {
        setCollectionError("");

        await Excel.run(async (context) => {

            try {

                const workbook = context.workbook.worksheets.getItem(selectedInputWorksheet);

                const range = workbook.getRange(selectedInputRange);
                range.load("values");
                await context.sync();

                const {values} = range;

                const parsedIds = values
                    .map(x => Number(x))
                    .filter(x => !isNaN(x) && x > 0);

                debugger
                const result = await similaritySearchById(selectedCollection, parsedIds
                    , selectedTopK + 1);

                if (!result.recommendation) {
                    return;
                }
                const output = [];
                const header = [`source "${selectedCollection}" id`, `similar id`, "distance"]
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
            }
        });
    };

    return (
        <div>
            <CForm className={"p-3"} onSubmit={handleSubmit}>
                <CRow>
                    <CCol xs={{span: 8}} sm={{span: 10}}>
                        <CFormSelect
                            onChange={e => setSelectedCollection(e.target.value)}
                            options={collectionItems()}
                            label={databaseInfo.length == 0 ? "Please wait, loading..." : "Choose a model"}
                        />
                        {apiError && <div className={"error-message"}>{apiError}</div>}
                    </CCol>

                    <CCol xs={{span: 4}} sm={{span: 2}}>
                        <CFormSelect
                            onChange={e => setSelectedTopK(parseInt(e.target.value))}
                            options={topKOptions.map(x => x.toString())}
                            label="TopK"
                        />
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
                                Find Similar
                            </CButton>
                        </CCol>

                    </Fragment>
                )}
            </CForm>

        </div>
    );
}

export default SimilarById;
