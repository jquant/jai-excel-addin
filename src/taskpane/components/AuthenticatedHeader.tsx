import * as React from "react";
import { AuthenticationContext } from "../../hoc/AuthenticationContext";
import { useContext } from "react";

function AuthenticatedHeader(props) {

  const { apiKey, environmentName } = useContext(AuthenticationContext);
  const logo = require("./../../../assets/logo-filled.png");

  const maskedApiKey = () => {

    if (!apiKey)
      return "";

    const start = apiKey.substring(0, 4);
    const end = apiKey.substring(28);

    return `${start}..${end}`;
  };

  return (
    <section
      className="ms-welcome__header ms-bgColor-white ms-u-fadeIn500"
      style={{ textAlign: "center" }}>

      <img width="90" height="70" src={logo} alt={"JAI"} title={"JAI"} />

      <span className=" ms-fontWeight-light ms-fontColor-neutralPrimary mb-1">
        Your Api Key: <strong>{maskedApiKey()}</strong>
      </span>

      <span className=" ms-fontWeight-light ms-fontColor-neutralPrimary mb-1">
        Current Environment: <strong>{environmentName}</strong>
      </span>

      <button onClick={() => props.onLogoff()}>
        Logoff
      </button>
    </section>
  );
}

export default AuthenticatedHeader;
