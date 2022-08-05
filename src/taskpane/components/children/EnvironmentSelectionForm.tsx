import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {CButton, CCol, CForm, CFormSelect} from "@coreui/react";
import {authenticate, getEnvironments} from "jai-sdk";
import {AuthenticationContext} from "../../../hoc/AuthenticationContext";
import Puff from "react-loading-icons/dist/esm/components/puff";

function EnvironmentSelectionForm(props) {
    const [apiError, setApiError] = useState("");
    const [selectedEnvironment, setSelectedEnvironment] = useState("");
    const [validated, setValidated] = useState(false);
    const [environments, setEnvironments] = useState([]);

    const [loading, setLoading] = useState(false);

    const {apiKey} = useContext(AuthenticationContext);

    useEffect(() => {
        setLoading(true);
        authenticate(apiKey);
        try {
            getEnvironments().then((data) => {
                    setEnvironments(data);
                    if (data) {
                        setSelectedEnvironment(data[0].name);
                    }
                },
                (e) => {
                    debugger
                    let json = JSON.stringify(e);
                    let parsed = JSON.parse(json);
                    if (parsed.status == 401) {
                        setApiError("Your Api Key is invalid. Please logoff and try again.")
                        return;
                    }
                    setApiError(e.message)
                }
            );
        } finally {
            setLoading(false);
        }
    }, [apiKey]);

    const handleSubmit = (event) => {
        try {
            setApiError("");
            event.preventDefault();

            const form = event.currentTarget;
            if (form.checkValidity() === false) {
                event.stopPropagation();
            }

            setValidated(true);

            props.onEnvironmentSelected(selectedEnvironment);

        } catch (e) {
            setApiError(e.message);
        }
    };

    const onSelectChange = (e) => {
        setApiError("");
        setSelectedEnvironment(e.target.value);
    };

    const environmentSelectionLabel = () => {
        if (loading)
            return (
                <div>
                    Please wait, loading...<Puff className={"label-spin-loading"} stroke="#f95f18"/>
                </div>
            );

        return (
            <div>
                Select an Environment
            </div>
        );
    };

    return (
        <div>
            <CForm className={"row p-3"} noValidate validated={validated} onSubmit={handleSubmit}>
                <CCol md={12} className={"pb-2"}>
                    {environments && (
                        <CFormSelect
                            options={environments.map(({key, name}) => ({value: key || name, label: name}))}
                            label={environmentSelectionLabel()}
                            onChange={onSelectChange}
                        />
                    )}

                    {apiError && <div className={"error-message"}>{apiError}</div>}
                </CCol>

                <CCol md={12}>
                    <CButton
                        disabled={!environments}
                        className="ms-welcome__action"

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
