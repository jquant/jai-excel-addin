import * as React from "react";
import {Fragment, useContext, useEffect, useState} from "react";

import {CButton, CCol, CForm, CFormInput, CFormLabel, CFormSelect, CRow} from "@coreui/react";

import {authenticate, getDatabaseInfo, recommendationById, setEnvironment, similaritySearchById} from "jai-sdk";

import {DatabaseInfo} from "jai-sdk/dist/tsc/collection-management/database-info/types";
import {AuthenticationContext} from "../../../../hoc/AuthenticationContext";
import {topKOptions} from "../../../../constants/listing/topk";
import {extractCollectionRange, implementNumberedRangeOnSelection,} from "../../../../services/excel-range-filtering";
import {QueryKeys, queryTypesList} from "../../../../operations/querytypes";
import Puff from "react-loading-icons/dist/esm/components/puff";


function Recommendation() {
    const {apiKey, environmentName} = useContext(AuthenticationContext);

    const [apiError, setApiError] = useState("");
    const [collectionError, setCollectionError] = useState("");
    const [databaseInfo, setDatabaseInfo] = useState([]);
    const [queryTypeOptions, setQueryTypeOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const [collectionOriginalParent1, setCollectionOriginalParent1] = useState("");
    const [collectionOriginalParent2, setCollectionOriginalParent2] = useState("");

    const [selectedParent1, setSelectedParent1] = useState("");
    const [selectedParent2, setSelectedParent2] = useState("");

    const [selectedCollection, setSelectedCollection] = useState("");
    const [selectedQueryType, setSelectedQueryType] = useState("");
    const [selectedTopK, setSelectedTopK] = useState(5);

    const [selectedInputRange, setSelectedInputRange] = useState("");
    const [selectedInputWorksheet, setSelectedInputWorksheet] = useState("");

    const [selectedOutputRange, setSelectedOutputRange] = useState("");

    useEffect(() => {
        authenticate(apiKey);
        setEnvironment(environmentName);

        getDatabaseInfo("complete").then(
            (data: DatabaseInfo[]) => {
                if (data) {
                    setDatabaseInfo(data);
                }
            },
            (e) => setApiError(e.message)
        );
    }, [apiKey, environmentName]);

    useEffect(() => {
        if (selectedQueryType == QueryKeys.AtoB || selectedQueryType == QueryKeys.ALookalike) {
            setSelectedParent1(collectionOriginalParent1);
            setSelectedParent2(collectionOriginalParent2);
        }
        if (selectedQueryType == QueryKeys.BtoA || selectedQueryType == QueryKeys.BLookalike) {
            setSelectedParent1(collectionOriginalParent2);
            setSelectedParent2(collectionOriginalParent1);
        }
    }, [selectedQueryType]);


    const handleSubmit = async (event) => {
        try {
            event.preventDefault();
            setApiError("");
        } catch (error) {
            setApiError(error.message);
        }
    };

    const recSysCollectionItems = () => {
        const mapped = databaseInfo
            .filter((x) => x.db_type === "RecommendationSystem")
            .map(({db_name}) => db_name)
            .sort();
        return ['Select...', ...mapped];
    };

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
        setCollectionError("");

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

    const collectionSelected = () => !!selectedCollection;
    const queryTypeSelected = () => !!selectedQueryType;

    const recSysLabel = () => {
        if (databaseInfo.length == 0)
            return (
                <div>
                    Please wait, loading...<Puff className={"label-spin-loading"} stroke="#f95f18"/>
                </div>
            );

        return (
            <div>
                Select the RecSys
            </div>
        );
    };

    const sourceQueryTypeLabel = () => {
        return "Select the query type";
    };

    const inputRangeSelectionText = () => {
        return (
            <Fragment>
                Input id range for <strong>'{selectedParent1}'</strong>
            </Fragment>
        )
    };

    const outputRangeSelectionText = () => {
        let selectedOutputParent = selectedParent2;
        if (selectedQueryType == QueryKeys.ALookalike || selectedQueryType == QueryKeys.BLookalike) {
            selectedOutputParent = selectedParent1;
        }
        return (
            <Fragment>
                Output range for <strong>'{selectedOutputParent}'</strong>
            </Fragment>
        );
    }


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

                const parsedIds = values.map((x) => Number(x)).filter((x) => !isNaN(x) && x > 0);

                const result = await getResults(parsedIds);

                const output = getOutPut(result);
                const header = output[0];

                const collectionRange = extractCollectionRange(selectedOutputRange, header.length, output.length);

                workbook.getRange(collectionRange).values = output;

                await context.sync();

                console.debug(output);
            } catch (e) {
                console.error(e);
                setCollectionError("Error getting output results.")
            } finally {
                setLoading(false);
            }
        });
    };

    const getResults = async (parsedIds: number[]) => {
        if (selectedQueryType == QueryKeys.AtoB) {
            return await recommendationById(collectionOriginalParent1, parsedIds, selectedTopK);
        }

        if (selectedQueryType == QueryKeys.BtoA) {
            return await recommendationById(collectionOriginalParent2, parsedIds, selectedTopK);
        }

        if (selectedQueryType == QueryKeys.ALookalike) {
            return await similaritySearchById(collectionOriginalParent1, parsedIds, selectedTopK + 1);
        }
        if (selectedQueryType == QueryKeys.BLookalike) {
            return await similaritySearchById(collectionOriginalParent2, parsedIds, selectedTopK + 1);
        }
    }

    const getOutPut = (result) => {
        const output = [];

        if (selectedQueryType == QueryKeys.AtoB || selectedQueryType == QueryKeys.BtoA) {
            const header = [`source "${selectedParent1}" id`, `recommended "${selectedParent2}" id`, "distance"]
            output.push(header);

            if (!result.recommendation) {
                return output;
            }

            for (const {query_id, results} of result.recommendation) {
                for (let i = 0; i < results.length; i++) {
                    const {id, distance} = results[i];
                    output.push([query_id, id, distance]);
                }
            }

            return output;
        }

        if (selectedQueryType == QueryKeys.ALookalike || selectedQueryType == QueryKeys.BLookalike) {
            const header = [`source "${selectedParent1}" id`, `similar "${selectedParent1}" id`, "distance"]
            output.push(header);

            if (!result.similarity) {
                return output;
            }

            for (const {query_id, results} of result.similarity) {
                for (let i = 1; i < results.length; i++) {
                    const {id, distance} = results[i];
                    output.push([query_id, id, distance]);
                }
            }
        }

        return output;
    }

    const runLabel = () => {
        if (loading)
            return (
                <div>
                    Loading <Puff className={"button-spin-loading"} stroke="#ffffff"/>
                </div>
            );

        return (
            <div>
                Recommend
            </div>
        );
    };

    const recSysChanged = (value) => {
        setSelectedCollection(value);
        const selectedRecSys = databaseInfo.find(x => x.db_name == value);

        let parent1 = selectedRecSys.db_parents[0];
        setCollectionOriginalParent1(parent1);
        let parent2 = selectedRecSys.db_parents[1];
        setCollectionOriginalParent2(parent2);

        let options = queryTypesList(parent1, parent2);

        setQueryTypeOptions([...options]);

        queryTypeChanged(options[0].value);
    };

    const queryTypeChanged = (value) => {
        setSelectedQueryType(value);
    };

    return (
        <CForm className={"p-3"} onSubmit={handleSubmit}>
            <CRow>
                <CCol xs={{span: 8}} sm={{span: 10}}>
                    <CFormLabel className={"form-label"}>{recSysLabel()}</CFormLabel>
                    <CFormSelect
                        onChange={(e) => recSysChanged(e.target.value)}
                        options={recSysCollectionItems()}
                    />
                    {apiError && <div className={"error-message"}>{apiError}</div>}
                </CCol>
                <CCol xs={{span: 4}} sm={{span: 2}}>
                    <CFormSelect
                        onChange={(e) => setSelectedTopK(parseInt(e.target.value))}
                        options={topKOptions.map((x) => x.toString())}
                        label="TopK"
                    />
                </CCol>
            </CRow>

            {collectionSelected() && (
                <Fragment>
                    <CRow>
                        <CCol xs={{span: 12}} sm={{span: 12}}>
                            <CFormSelect
                                onChange={(e) => queryTypeChanged(e.target.value)}
                                value={selectedQueryType}
                                options={queryTypeOptions}
                                label={sourceQueryTypeLabel()}
                            />
                        </CCol>
                    </CRow>

                </Fragment>
            )}

            {queryTypeSelected() && (
                <Fragment>
                    <CRow>
                        <CCol xs={{span: 10}} sm={{span: 10}}>
                            <CFormInput required className={"mb-1"} label={inputRangeSelectionText()}
                                        value={selectedInputRange}/>
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
                                label={outputRangeSelectionText()}
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
                    <CRow>
                        <CCol md={12}>
                            <CButton className={"mt-10 run-button w-100"} disabled={!validToRunReport()}
                                     onClick={() => run()}>
                                {runLabel()}
                            </CButton>
                        </CCol>
                    </CRow>
                </Fragment>
            )}
        </CForm>
    );
}

export default Recommendation;
