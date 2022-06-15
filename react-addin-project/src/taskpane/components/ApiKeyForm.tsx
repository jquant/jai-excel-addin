import * as React from "react";
import { useState } from "react";
import { CButton, CCol, CForm, CFormInput } from "@coreui/react";
import { authenticate, getDatabaseInfo, getEnvironments } from "jai-sdk";

function ApiKeyForm() {
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
      console.log(apiKey);

      authenticate(apiKey);

      console.log(await getEnvironments());

      console.log(await getDatabaseInfo("complete"));
    } catch (error) {
      console.log(error);
      setApiError(error.message);
    }
  };

  const onApiKeyChange = (e) => {
    setApiError("");
    setApiKey(e.target.value);
  };

  return (
    <CForm className={"row p-3"} noValidate validated={validated} onSubmit={handleSubmit}>
      <CCol md={12} className={"pb-1"}>
        <CFormInput
          required
          className={"mb-1"}
          label="Insert your Api Key"
          placeholder="Api Key"
          onChange={onApiKeyChange}
          feedbackInvalid="Please, insert an valid Api Key."
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
  );
}

export default ApiKeyForm;
