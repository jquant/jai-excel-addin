import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { CButton, CCol, CForm } from "@coreui/react";
import Header from "../Header";
import * as api from "jai-sdk";

function CollectionsForm() {
  const [apiError, setApiError] = useState("");
  const [validated, setValidated] = useState(false);

  const getDatabaseInfo = useCallback(async () => {
    try {
    } catch (error) {
      setApiError(error);
    }
  }, []);

  useEffect(() => {
    getDatabaseInfo();
  }, []);

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setApiError("");

      console.log(await api.getDatabaseInfo("complete"));
    } catch (error) {
      setApiError(error.message);
    }
  };

  return (
    <div>
      <Header></Header>
      <CForm className={"row p-3"} noValidate validated={validated} onSubmit={handleSubmit}>
        <CCol md={12} className={"pb-1"}>
          {apiError && <div className={"error-message"}>{apiError}</div>}
        </CCol>

        <CCol md={12}>
          <CButton className="ms-welcome__action" color="dark" variant="outline" type={"submit"}>
            Select
          </CButton>
        </CCol>
      </CForm>
    </div>
  );
}

export default CollectionsForm;
