import * as React from "react";
import { useState } from "react";
import { CButton, CCol, CForm, CFormSelect } from "@coreui/react";
import { getDatabaseInfo, getEnvironments } from "jai-sdk";

function EnvironmentsForm() {
  const [apiError, setApiError] = useState("");
  const [environment, setEnvironment] = useState("");
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
    await setEnvironmentAsync();
  };

  const setEnvironmentAsync = async () => {
    try {
      console.log(await getEnvironments());

      console.log(await getDatabaseInfo("complete"));
    } catch (error) {
      console.log(error);
      setApiError(error.message);
    }
  };

  const onApiKeyChange = (e) => {
    setApiError("");
    setEnvironment(e.target.value);
  };

  const options = [
    "Open this select menu",
    {
      value: 0,
      text: "Angular",
    },
    {
      value: 1,
      text: "Bootstrap",
    },
    {
      value: 2,
      text: "React.js",
    },
    {
      value: 3,
      text: "Vue.js",
    },
    {
      label: "backend",
      options: [
        {
          value: 4,
          text: "Django",
        },
        {
          value: 5,
          text: "Laravel",
        },
        {
          value: 6,
          text: "Node.js",
        },
      ],
    },
  ];

  return (
    <CForm className={"row p-3"} noValidate validated={validated} onSubmit={handleSubmit}>
      <CCol md={12} className={"pb-1"}>
        <CFormSelect options={["js", "html"]} />
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

export default EnvironmentsForm;
