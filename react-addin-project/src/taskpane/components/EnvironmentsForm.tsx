// import * as React from "react";
// import { useState } from "react";
// import { CButton, CCol, CForm, CFormSelect } from "@coreui/react";
// import { authenticate, getDatabaseInfo, getEnvironments } from "jai-sdk";
//
// export const EnvironmentsForm = () => {
//   const [validated, setValidated] = useState(false);
//   const handleSubmit = (event) => {
//     event.preventDefault();
//
//     const form = event.currentTarget;
//     if (form.checkValidity() === false) {
//       event.stopPropagation();
//     }
//
//     setValidated(true);
//   };
//
//   const getEnvironmentsAsync = async () => {
//     try {
//       if (!this.apiKey) {
//         return;
//       }
//       authenticate(this.apiKey);
//
//       this.environments = await getEnvironments();
//       console.log(this.environments);
//
//       isAuthenticated = true;
//
//       console.log(await getDatabaseInfo("complete"));
//     } catch (error) {
//       console.error(error);
//     }
//   };
//
//   return (
//     <CForm className={"row p-3"} noValidate validated={validated} onSubmit={handleSubmit}>
//       <CCol md={12}>
//         <CFormSelect
//           className={"mb-2"}
//           label="Select an environment"
//           placeholder="Environments..."
//           feedbackInvalid="Please choose an environment."
//           id="apiKey"
//         />
//       </CCol>
//       <CCol md={12}>
//         <CButton className="ms-welcome__action" color="dark" variant="outline" type={"submit"}>
//           Select
//         </CButton>
//       </CCol>
//     </CForm>
//   );
// };
