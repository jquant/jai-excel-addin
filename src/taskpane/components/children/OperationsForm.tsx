import * as React from "react";
import { CCol, CForm, CFormSelect } from "@coreui/react";
import { operations } from "../../../operations/operations";

function OperationsForm(props) {
  const onSelectChange = (e) => {
    props.onOperationSelected(e.target.value);
  };
  return (
    <div>
      <CForm className={"row p-3"}>
        <CCol md={12} className={"pb-2"}>
          <CFormSelect label="Choose your query type" value={props.selectedValue} onChange={onSelectChange}>
            {operations.map(({ key, name }) => {
              return (
                <option key={key} value={key}>{name}</option>
              );
            })}
          </CFormSelect>
        </CCol>
      </CForm>
    </div>
  );
}

export default OperationsForm;
