import * as React from "react";

function AuthenticatedHeader(props) {
  return (
    <section className="ms-welcome__header ms-bgColor-white ms-u-fadeIn500" style={{ textAlign: "center" }}>
      <img width="90" height="70" src={require("./../../../assets/logo-filled.png")} alt={"JAI"} title={"JAI"} />
      <span className=" ms-fontWeight-light ms-fontColor-neutralPrimary mb-1">Your Api Key: {props.apiKey}</span>
      <span className=" ms-fontWeight-light ms-fontColor-neutralPrimary mb-1">
        Current Environment: {props.selectedEnvironment}
      </span>
    </section>
  );
}

export default AuthenticatedHeader;
