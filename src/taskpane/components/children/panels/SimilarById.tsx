import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { CCol, CForm, CFormSelect } from "@coreui/react";
import { getDatabaseInfo } from "jai-sdk";
import { DatabaseInfo } from "jai-sdk/dist/tsc/collection-management/database-info/types";
import { AuthenticationContext } from "../../../../hoc/AuthenticationContext";

function SimilarById() {

  const { apiKey, environmentName } = useContext(AuthenticationContext);

  const [apiError, setApiError] = useState("");
  const [databaseInfos, setDatabaseInfos] = useState([]);

  useEffect(() => {
    getDatabaseInfo("complete").then(
      (data: DatabaseInfo[]) => {
        setDatabaseInfos(data);
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
      </CForm>
    </div>
  );
}

export default SimilarById;
