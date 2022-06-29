import * as React from "react";
import PropTypes from "prop-types";
import { CCol, CForm, CFormSelect } from "@coreui/react";
import { operations } from "../../../operations/operations";

function OperationsForm({ onOperationSelected, selectedValue }) {
  const onSelectChange = (e) => {
    onOperationSelected(e.target.value);
  };
  return (
    <div>
      <CForm className={"row p-3"}>
        <CCol md={12} className={"pb-2"}>
          <CFormSelect label="Choose your query type" value={selectedValue} onChange={onSelectChange}>
            <option>Please, select one...</option>
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

OperationsForm.propTypes = {
  onOperationSelected: PropTypes.func,
  selectedValue: PropTypes.string
};

export default OperationsForm;
