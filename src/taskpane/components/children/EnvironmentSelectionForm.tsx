import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { CButton, CCol, CForm, CFormSelect } from "@coreui/react";
import * as api from "jai-sdk";
import Header from "../Header";

function EnvironmentSelectionForm(props) {
  const [apiError, setApiError] = useState("");
  const [selectedEnvironment, setSelectedEnvironment] = useState("");
  const [validated, setValidated] = useState(false);
  const options = [{ id: "", name: "Select..." }];
  const [environments, setEnvironments] = useState(options);

  const getEnvironments = useCallback(async () => {
    try {
      let response = await api.getEnvironments();
      response.map((x) => {
        setEnvironments((env) => [...env, x]);
      });
    } catch (error) {
      setApiError(error.message);
    }
  }, []);

  useEffect(() => {
    getEnvironments();
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

    await setEnvironmentAsync();
  };

  const setEnvironmentAsync = async () => {
    try {
      await api.setEnvironment(selectedEnvironment);

      let environment = environments.find((x) => x.id == selectedEnvironment);

      props.onEnvironmentSelected(environment.name);
    } catch (error) {
      setApiError(error.message);
      setValidated(false);
    }
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
          <CFormSelect
            options={environments.map(({ id, name }) => ({ value: id, label: name }))}
            label="Select an Environment"
            onChange={onSelectChange}
          />

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

export default EnvironmentSelectionForm;
