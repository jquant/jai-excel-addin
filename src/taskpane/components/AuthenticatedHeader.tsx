import * as React from "react";
import { AuthenticationContext } from "../../hoc/AuthenticationContext";
import { useContext } from "react";

function AuthenticatedHeader(props) {

  const { apiKey } = useContext(AuthenticationContext);

  const maskedApiKey = () => {

    if (!apiKey)
      return "";

    const start = apiKey.toString().substring(0, 4);
    const end = apiKey.toString().substring(28);

    return `${start}**************************${end}`;
  };

  return (
    <section className="ms-welcome__header ms-bgColor-white ms-u-fadeIn500"
             style={{ textAlign: "center" }}>
      <img width="90" height="70" src={require("./../../../assets/logo-filled.png")} alt={"JAI"} title={"JAI"} />
      <span
        className=" ms-fontWeight-light ms-fontColor-neutralPrimary mb-1">Your Api Key: {maskedApiKey()}</span>
      <span className=" ms-fontWeight-light ms-fontColor-neutralPrimary mb-1">
        Current Environment: {props.selectedEnvironment}
      </span>
    </section>
  );
}

export default AuthenticatedHeader;
