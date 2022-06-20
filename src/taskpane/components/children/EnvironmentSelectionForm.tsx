import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { CButton, CCol, CForm, CFormSelect } from "@coreui/react";
import { getEnvironments, setEnvironment } from "jai-sdk";
import Header from "../Header";

function EnvironmentSelectionForm(props) {

  const [apiError, setApiError] = useState("");
  const [selectedEnvironment, setSelectedEnvironment] = useState("");
  const [validated, setValidated] = useState(false);
  const [environments, setEnvironments] = useState([]);

  useEffect(() => {
    getEnvironments().then(data => {
      setEnvironments(data);
    }, e => console.error(e))
  }, []);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    setApiError("");

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
    event.preventDefault();

    setEnvironment(selectedEnvironment);
    props.onEnvironmentSelected();

  };

  const onSelectChange = (e) => {
    setApiError("");
    setSelectedEnvironment(e.target.value);
  };

  return (
    <div>
      <Header></Header>
      <CForm className={"row p-3"} noValidate validated={validated} onSubmit={handleSubmit}>
        <CCol md={12} className={"pb-1"}>

          {environments &&
            <CFormSelect
              options={environments.map(({ key, id, name }) => ({ value: (key || id), label: name }))}
              placeholder="Select an Environment"
              onChange={onSelectChange}
            />
          }

          {apiError &&
            <div className={"error-message"}>{apiError}</div>
          }
        </CCol>

        <CCol md={12}>
          <CButton disabled={!environments} className="ms-welcome__action" color="dark" variant="outline" type={"submit"}>
            Select
          </CButton>
        </CCol>
      </CForm>
    </div>
  );
}

export default EnvironmentSelectionForm;
