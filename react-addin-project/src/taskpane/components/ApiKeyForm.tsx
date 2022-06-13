import * as React from "react";
import { useState } from "react";
import { CButton, CCol, CForm, CFormInput } from "@coreui/react";

export const ApiKeyForm = () => {
  const [validated, setValidated] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    setValidated(true);
  };
  return (
    <CForm className={"row p-3"} noValidate validated={validated} onSubmit={handleSubmit}>
      <CCol md={12}>
        <CFormInput required className={"mb-2"} label="Insert your Api Key" placeholder="Api Key" id="apiKey" />
      </CCol>
      <CCol md={12}>
        <CButton className="ms-welcome__action" color="dark" variant="outline" type={"submit"}>
          Access
        </CButton>
      </CCol>
    </CForm>
  );
};
