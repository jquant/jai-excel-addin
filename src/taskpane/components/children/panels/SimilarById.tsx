import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { CCol, CForm, CFormSelect } from "@coreui/react";
import { authenticate, getDatabaseInfo, setEnvironment } from "jai-sdk";
import { DatabaseInfo } from "jai-sdk/dist/tsc/collection-management/database-info/types";
import { AuthenticationContext } from "../../../../hoc/AuthenticationContext";

function SimilarById() {

  const { apiKey, environmentName } = useContext(AuthenticationContext);

  const [apiError, setApiError] = useState("");
  const [databaseInfo, setDatabaseInfo] = useState([]);

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

    return databaseInfo
      .map(({ db_name }) => db_name)
      .sort();
  };

  return (
    <div>
      <CForm className={"row p-3"} onSubmit={handleSubmit}>
        <CCol md={12} className={"pb-2"}>
          <CFormSelect
            options={collectionItems()}
            label={databaseInfo.length == 0 ? "Please wait, loading..." : "Choose a model"}
          />
          {apiError && <div className={"error-message"}>{apiError}</div>}
        </CCol>
      </CForm>
    </div>
  );
}

export default SimilarById;
