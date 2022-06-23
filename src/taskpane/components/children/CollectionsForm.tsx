import * as React from "react";
import { useEffect, useState } from "react";
import { CButton, CCol, CForm, CFormSelect } from "@coreui/react";
import { getDatabaseInfo } from "jai-sdk";
import { DatabaseInfo } from "jai-sdk/dist/tsc/collection-management/database-info/types";

function CollectionsForm() {
  const [apiError, setApiError] = useState("");
  const [databaseInfos, setDatabaseInfos] = useState([]);

  useEffect(() => {
    getDatabaseInfo("complete").then(
      (data: DatabaseInfo[]) => {
        setDatabaseInfos(data);
      },
      (e) => setApiError(e.message)
    );
  }, []);

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setApiError("");
    } catch (error) {
      setApiError(error.message);
    }
  };

  return (
    <div>
      <CForm className={"row p-3"} onSubmit={handleSubmit}>
        <CCol md={12} className={"pb-2"}>
          <CFormSelect
            options={databaseInfos.map(({ db_name }) => ({ value: db_name, label: db_name }))}
            label="Choose a model"
          />
          {apiError && <div className={"error-message"}>{apiError}</div>}
        </CCol>

        <CCol md={12}>
          <CButton className="ms-welcome__action" color="dark" variant="outline" type={"submit"}>
            Select
          </CButton>
        </CCol>

        <CCol md={12} className={"pb-2"}>
          <CFormSelect label="Choose your query type">
            <option value="1">Recommend</option>
            <option value="2">Similarity by Id</option>
            <option value="3">Prediction</option>
          </CFormSelect>
        </CCol>
      </CForm>
    </div>
  );
}

export default CollectionsForm;
