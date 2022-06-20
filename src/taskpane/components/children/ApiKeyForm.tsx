import * as React from "react";
import { useState } from "react";
import { CButton, CCol, CForm, CFormInput } from "@coreui/react";
import { authenticate } from "jai-sdk";
import Header from "../Header";

function ApiKeyForm(props) {
  const [apiError, setApiError] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    setApiError("");

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);

    event.preventDefault();
    await authenticateAsync();
  };

  const authenticateAsync = async () => {
    try {
      if (!apiKey) {
        return;
      }

      authenticate(apiKey);

      props.onAuthenticated(apiKey);
    } catch (error) {
      setApiError(error.message);
    }
  };

  const onApiKeyChange = (e) => {
    setApiError("");
    setApiKey(e.target.value);
  };

  return (
    <div className="ms-welcome">
      <Header></Header>
      <CForm className={"row p-3"} noValidate validated={validated} onSubmit={handleSubmit}>
        <CCol md={12} className={"pb-1"}>
          <CFormInput
            required
            className={"mb-1"}
            label="Insert your Api Key"
            placeholder="Api Key"
            value={apiKey}
            onChange={onApiKeyChange}
            feedbackInvalid="Please, insert an Api Key."
            id="apiKey"
          />
          {apiError && <div className={"error-message"}>{apiError}</div>}
        </CCol>
        <CCol md={12}>
          <CButton className="ms-welcome__action" color="dark" variant="outline" type={"submit"}>
            Access
          </CButton>
        </CCol>
      </CForm>
    </div>
  );
}

export default ApiKeyForm;
