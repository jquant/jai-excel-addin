import * as React from "react";
import { CCol, CForm, CFormSelect } from "@coreui/react";

function OperationsForm(props) {
  const onSelectChange = (e) => {
    props.onOperationSelected(e.target.value);
  };
  return (
    <div>
      <CForm className={"row p-3"}>
        <CCol md={12} className={"pb-2"}>
          <CFormSelect label="Choose your query type" value={props.selectedValue} onChange={onSelectChange}>
            <option value="similarity-by-id">Similarity by Id</option>
            <option value="prediction">Prediction</option>
            <option value="recommendation">Recommendation</option>
          </CFormSelect>
        </CCol>
      </CForm>
    </div>
  );
}

export default OperationsForm;
