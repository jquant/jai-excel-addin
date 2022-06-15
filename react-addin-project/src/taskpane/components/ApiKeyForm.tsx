import * as React from "react";
import { useState } from "react";
import { CButton, CCol, CForm, CFormInput } from "@coreui/react";
import { authenticate, getDatabaseInfo, getEnvironments } from "jai-sdk";

function ApiKeyForm() {
  const [state, setState] = useState({
    error: null,
    apiKey: null,
    validated: false,
  });

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    console.log(form);

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setState({
      ...state,
      validated: true,
    });

    await authenticateAsync();
    event.preventDefault();
  };

  const authenticateAsync = async () => {
    try {
      if (!state.apiKey) {
        return;
      }
      console.log(state.apiKey);

      authenticate(state.apiKey);

      console.log(await getEnvironments());

      console.log(await getDatabaseInfo("complete"));
    } catch (error) {
      console.log(error);

      setState({
        ...state,
        error: error.message,
      });
    }
  };

  return (
    <CForm className={"row p-3"} noValidate validated={state.validated} onSubmit={handleSubmit}>
      <CCol md={12} className={"pb-1"}>
        <CFormInput
          required
          minLength={3}
          className={"mb-1"}
          label="Insert your Api Key"
          placeholder="Api Key"
          onChange={(e) =>
            setState({
              ...state,
              apiKey: e.target.value,
            })
          }
          feedbackInvalid="Please, insert an valid Api Key."
          id="apiKey"
        />
      </CCol>

      {state.error && <div color={"red"}>{state.error}</div>}

      <CCol md={12}>
        <CButton className="ms-welcome__action" color="dark" variant="outline" type={"submit"}>
          Access
        </CButton>
      </CCol>
    </CForm>
  );
}

export default ApiKeyForm;
