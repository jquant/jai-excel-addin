import * as React from "react";

export default class AnonymousHeader extends React.Component {

  render() {
    const logo = require("./../../../assets/logo-filled.png");
    return (
      <section className="ms-welcome__header ms-bgColor-white ms-u-fadeIn500">
        <img width="90" height="70" src={logo} alt={"JAI"} title={"JAI"} />
        <h1 className="ms-fontSize-su ms-fontWeight-light ms-fontColor-neutralPrimary mb-1">Welcome</h1>
      </section>
    );
  }
}
