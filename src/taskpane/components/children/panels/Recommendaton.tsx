import * as React from "react";
import { Fragment, useContext, useEffect, useState } from "react";

import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CRow
} from "@coreui/react";

import {
  authenticate,
  getDatabaseInfo,
  setEnvironment,
  similaritySearchById,
  getDatabaseDescription
} from "jai-sdk";

import { DatabaseInfo } from "jai-sdk/dist/tsc/collection-management/database-info/types";
import { AuthenticationContext } from "../../../../hoc/AuthenticationContext";
import { topKOptions } from "../../../../constants/listing/topk";

function Recommendaton() {

  const { apiKey, environmentName } = useContext(AuthenticationContext);

  const [apiError, setApiError] = useState("");
  const [databaseInfo, setDatabaseInfo] = useState([]);

  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedTopK, setSelectedTopK] = useState(5);

  const [selectedInputRange, setSelectedInputRange] = useState("");
  const [selectedInputWorksheet, setSelectedInputWorksheet] = useState("");

  const [selectedOutputRange, setSelectedOutputRange] = useState("");
  const [twinBaseName, setTwinBaseName] = useState("");

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

  useEffect(() => {
    getTwinBase();
  }, [selectedCollection]);

  const getTwinBase = () => {

    if (!selectedCollection)
      return;

    getDatabaseDescription(selectedCollection).then(databaseInfo => {
      setTwinBaseName(databaseInfo.twin_base);
    });
  };

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
      .filter(x => x.db_type === "Recommendation")
      .map(({ db_name }) => db_name)
      .sort();

    return [
      "Select...",
      ...mapped
    ];
  };

  const lockInputRange = async () => {
    await Excel.run(async (context) => {
      const range = context.workbook.getSelectedRange();

      range.load(["address", "worksheet"]);

      await context.sync();

      setSelectedInputRange(range.address);
      setSelectedInputWorksheet(range.worksheet.name);
    });
  };

  const lockOutputRange = async () => {
    await Excel.run(async (context) => {
      let range = context.workbook.getSelectedRange();

      range.load(["address", "worksheet"]);

      await context.sync();

      setSelectedOutputRange(range.address);
    });
  };

  const validToRunReport = () => {
    return selectedOutputRange && selectedInputRange;
  };

  const collectionSelected = () => !!selectedCollection;

  const sourceTableLabel = () => {

    if (databaseInfo.length == 0)
      return "Please wait, loading...";

    return "Select the source table";
  };

  const inputRangeSelectionText = () => (
    <Fragment>
      Input id range for <strong>'{selectedCollection}'</strong>
    </Fragment>
  );

  const outputRangeSelectionText = () => (
    <Fragment>
      Output range for <strong>'{twinBaseName}'</strong>
    </Fragment>
  );

  const run = async () => {
    await Excel.run(async (context) => {

      try {

        const workbook = context.workbook.worksheets.getItem(selectedInputWorksheet);

        const range = workbook.getRange(selectedInputRange);
        range.load("values");
        await context.sync();

        const { values } = range;

        const parsedIds = values
          .map(x => Number(x))
          .filter(x => !isNaN(x) && x > 0);

        console.debug("collection", selectedCollection);
        console.debug("ids", parsedIds);

        const result = await similaritySearchById(selectedCollection, parsedIds
          , selectedTopK + 1);

        const output = [["source id", "similar id", "distance"]];

        for (const { results } of result.similarity) {
          const { id: sourceId } = results[0];
          for (let i = 1; i < results.length; i++) {
            const { id, distance } = results[i];

            output.push([sourceId, id, distance]);
          }
        }

        workbook.getRange(`A1:C${output.length}`).values = output;
        await context.sync();

        console.debug(output);

      } catch (e) {
        console.error(e);
      }
    });
  };

  return (
    <CContainer className="overflow-hidden">

      <CForm className={"row p-3"} onSubmit={handleSubmit}>

        <CRow xs={{ gutterY: 2 }}>

          <CCol xs={{ span: 10 }}>
            <CFormSelect
              onChange={e => setSelectedCollection(e.target.value)}
              options={collectionItems()}
              label={sourceTableLabel()}
            />
            {apiError && <div className={"error-message"}>{apiError}</div>}
          </CCol>

          <CCol>
            <CFormSelect
              onChange={e => setSelectedTopK(parseInt(e.target.value))}
              options={topKOptions.map(x => x.toString())}
              label="TopK"
            />

            {apiError && <div className={"error-message"}>{apiError}</div>}
          </CCol>

        </CRow>

        {twinBaseName &&
          <CRow xs={{ gutterY: 2 }}>
            <CCol>
              <CFormInput
                label="Recommendation Output Table (Twin Base)"
                value={twinBaseName}
              />
            </CCol>
          </CRow>
        }

        {collectionSelected() &&

          <Fragment>
            <CRow xs={{ gutterY: 2 }}>
              <CCol xs={{ span: 10 }}>
                <CFormInput
                  required
                  className={"mb-1"}
                  label={inputRangeSelectionText()}
                  value={selectedInputRange}
                  feedbackInvalid="Please, insert an Api Key."
                  id="apiKey"
                />
              </CCol>
              <CCol className="d-flex flex-column">
                <CButton
                  className="lock-button"
                  color="dark"
                  onClick={() => lockInputRange()}>
                  Lock
                </CButton>
              </CCol>
            </CRow>

            <CRow xs={{ gutterY: 2 }}>
              <CCol xs={{ span: 10 }}>
                <CFormInput
                  required
                  className={"mb-1"}
                  label={outputRangeSelectionText()}
                  value={selectedOutputRange}
                  feedbackInvalid="Please, insert an Api Key."
                  id="apiKey"
                />
              </CCol>
              <CCol className="d-flex flex-column">
                <CButton
                  className="lock-button"
                  color="dark"
                  onClick={() => lockOutputRange()}>
                  Lock
                </CButton>
              </CCol>
            </CRow>

            <CRow xs={{ gutterY: 2 }}>
              <CCol md={12}>
                <CButton color="success"
                         disabled={!validToRunReport()}
                         onClick={() => run()}>
                  Recommend
                </CButton>
              </CCol>
            </CRow>

          </Fragment>
        }

      </CForm>

    </CContainer>
  );
}

export default Recommendaton;
