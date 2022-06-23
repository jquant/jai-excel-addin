import * as React from "react";
import { useEffect, useState } from "react";
import { CButton, CCol, CForm, CFormSelect } from "@coreui/react";
import { getEnvironments, setEnvironment } from "jai-sdk";

function EnvironmentSelectionForm(props) {
  const [apiError, setApiError] = useState("");
  const [selectedEnvironment, setSelectedEnvironment] = useState("");
  const [validated, setValidated] = useState(false);
  const [environments, setEnvironments] = useState([]);

  useEffect(() => {
    getEnvironments().then(
      (data) => {
        setEnvironments(data);
        if (data) {
          setSelectedEnvironment(data[0].name);
        }
      },
      (e) => setApiError(e.message)
    );
  }, []);

  const handleSubmit = (event) => {
    try {
      setApiError("");
      event.preventDefault();

      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.stopPropagation();
      }

      setValidated(true);

      setEnvironment(selectedEnvironment);
      props.onEnvironmentSelected(selectedEnvironment);
    } catch (e) {
      setApiError(e.message);
    }
  };

  const onSelectChange = (e) => {
    setApiError("");
    setSelectedEnvironment(e.target.value);
  };

  return (
    <div>
      <CForm className={"row p-3"} noValidate validated={validated} onSubmit={handleSubmit}>
        <CCol md={12} className={"pb-2"}>
          {environments && (
            <CFormSelect
              options={environments.map(({ name }) => ({ value: name, label: name }))}
              label="Select an Environment"
              onChange={onSelectChange}
            />
          )}

          {apiError && <div className={"error-message"}>{apiError}</div>}
        </CCol>

        <CCol md={12}>
          <CButton
            disabled={!environments}
            className="ms-welcome__action"
            color="dark"
            variant="outline"
            type={"submit"}
          >
            Select
          </CButton>
        </CCol>
      </CForm>
    </div>
  );
}

export default EnvironmentSelectionForm;
