import * as React from "react";
import { useState } from "react";
import { CButton, CCol, CForm, CFormInput } from "@coreui/react";
import { authenticate, getDatabaseInfo, getEnvironments } from "jai-sdk";

function ApiKeyForm() {
  let isAuthenticated: boolean = false;
  let invalidApi: boolean = false;

  const [apiKey, setApiKey] = useState("");

  const [validated, setValidated] = useState(false);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    console.log(form);

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
    await authenticateAsync();
    event.preventDefault();
  };

  const authenticateAsync = async () => {
    try {
      if (!apiKey) {
        return;
      }
      console.log(apiKey);

      authenticate(apiKey);

      console.log(await getEnvironments());

      isAuthenticated = true;

      console.log(await getDatabaseInfo("complete"));
    } catch (error) {
      console.log(error);
      invalidApi = true;
    }
  };

  return (
    <CForm className={"row p-3"} noValidate validated={validated} onSubmit={handleSubmit}>
      <CCol md={12} className={"pb-1"}>
        <CFormInput
          required
          minLength={3}
          className={"mb-1"}
          label="Insert your Api Key"
          placeholder="Api Key"
          onChange={(e) => setApiKey(e.target.value)}
          feedbackInvalid="Please, insert an valid Api Key."
          id="apiKey"
        />
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
