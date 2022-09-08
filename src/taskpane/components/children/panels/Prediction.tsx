import * as React from "react";
import {Fragment, useContext, useEffect, useState} from "react";
import {
    CButton,
    CCol,
    CForm,
    CFormCheck,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CListGroup,
    CListGroupItem,
    CRow
} from "@coreui/react";
import {authenticate, getDatabaseDescription, getDatabaseInfo, getIds, predict, setEnvironment} from "jai-sdk";
import {DatabaseInfo} from "jai-sdk/dist/tsc/collection-management/database-info/types";
import {AuthenticationContext} from "../../../../hoc/AuthenticationContext";
import {extractCollectionRange, implementNumberedRangeOnSelection} from "../../../../services/excel-range-filtering";
import Puff from "react-loading-icons/dist/esm/components/puff";
import {RequiredColumn} from "../../../../interfaces/requiredColumn";

function Prediction() {

    const {apiKey, environmentName} = useContext(AuthenticationContext);

    const [apiError, setApiError] = useState("");
    const [collectionError, setCollectionError] = useState("");
    const [databaseInfo, setDatabaseInfo] = useState([]);

    const [selectedCollection, setSelectedCollection] = useState("");
    const [requiredColumns, setRequiredColumns] = useState([]);

    const [loading, setLoading] = useState(false);

    const [selectedInputRange, setSelectedInputRange] = useState("");
    const [selectedInputWorksheet, setSelectedInputWorksheet] = useState("");

    const [selectedOutputRange, setSelectedOutputRange] = useState("");
    const [validInputRange, setValidInputRange] = useState(false);

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

                const workbook = context.workbook.worksheets.getItem(range.worksheet.name);

                const filteredRange = workbook.getRange(filtered);
                filteredRange.load("values");
                await context.sync();

                const {values} = filteredRange;

                const headerColumns = values[0];
                const requiredColumnsList = [...requiredColumns];

                for (let i = 0; i < requiredColumns.length; i++) {
                    const column = requiredColumnsList[i];
                    const checkbox = document.getElementById(column.name);

                    if (headerColumns.find(x => x == column.name)) {
                        checkbox.setAttribute('checked', 'checked');
                        column.valid = true;
                    } else {
                        checkbox.removeAttribute("checked");
                        column.valid = false;
                    }
                }

                validateRequiredColumns(requiredColumnsList);

            } catch (e) {
                console.log(e);
            }
        });
    };

    const validateRequiredColumns = (requiredColumnsList) => {
        if (requiredColumnsList.find(x => !x.valid)) {
            setValidInputRange(false);
            return
        }
        setValidInputRange(true);
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
        return selectedOutputRange && selectedInputRange && validInputRange;
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

                const headerColumns = values[0].filter(x => x);
                let data = [];

                for (let i = 1; i < values.length; i++) {
                    let row = values[i];
                    let map: { [key: string]: string } = {};

                    for (let j = 0; j < headerColumns.length; j++) {
                        let columnHeader = headerColumns[j];
                        map[`${columnHeader}`] = row[j];
                    }
                    data.push(map);
                }

                console.log("data", JSON.stringify(data))

                const result = await predict(selectedCollection, data, true);
                if (!result) {
                    return;
                }

                console.log("result", result)

                const output = [];
                const header = [`source "${selectedCollection}" id`, `prediction`, `probability`]
                output.push(header);

                for (let j = 0; j < result.length; j++) {
                    const item = result[j];

                    let itemValues: {
                        key: number,
                        value: number
                    }[] = Object.values(item.predict).filter(x => typeof x === 'number').map((x, i) => {
                        return {key: i, value: x as number}
                    });

                    const max = itemValues.reduce((prev, current) => {
                            return current.value > prev.value ? current : prev;
                        }
                    );

                    output.push([item.id, max.key, max.value]);
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

    const collectionChanged = async (value) => {
        try {
            setSelectedCollection(value);
            const selectedRecSys = databaseInfo.find(x => x.db_name == value);
            let databaseDescription = await getDatabaseDescription(selectedRecSys.db_name);

            let features: RequiredColumn[] = databaseDescription.features.filter(x => x['task'] === undefined)
                .map(x => {
                    let column: RequiredColumn = {
                        name: x.name,
                        valid: false
                    }
                    return column;
                });

            setRequiredColumns([...features]);
            setValidInputRange(false)

            let ids = await getIds(selectedRecSys.db_name, "complete");
        } catch (e) {
            setApiError(e.message)
        }
    };

    const requiredColumnsList = () => {
        if (!requiredColumns)
            return (
                <div>
                    Loading <Puff className={"button-spin-loading"} stroke="#ffffff"/>
                </div>
            );

        return (
            <CListGroup>
                {requiredColumns.map(x => {
                    return (
                        <Fragment>
                            <CListGroupItem><CFormCheck id={x.name} disabled></CFormCheck> {x.name}
                            </CListGroupItem>
                        </Fragment>
                    )
                })}
            </CListGroup>
        );
    };

    return (
        <div>
            <CForm className={"p-3"} onSubmit={handleSubmit}>
                <CRow>
                    <CCol xs={{span: 12}} sm={{span: 12}}>
                        <CFormSelect
                            onChange={e => collectionChanged(e.target.value)}
                            options={collectionItems()}
                            label={sourceQueryLabel()}
                        />
                        {apiError && <div className={"error-message"}>{apiError}</div>}
                    </CCol>
                </CRow>

                {collectionSelected() && (
                    <Fragment>
                        <CRow>
                            <CCol xs={{span: 12}} sm={{span: 12}}>
                                <CFormLabel>Required columns</CFormLabel>
                                {requiredColumnsList()}
                            </CCol>
                        </CRow>

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
