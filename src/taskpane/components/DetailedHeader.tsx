import * as React from "react";

export interface DetailedHeaderProps {
  apiKey: string;
  selectedEnvironment: string;
}

export default class DetailedHeader extends React.Component<DetailedHeaderProps> {
  render() {
    const { apiKey, selectedEnvironment } = this.props;

    return (
      <section className="ms-welcome__header ms-bgColor-white ms-u-fadeIn500" style={{ textAlign: "center" }}>
        <img width="90" height="70" src={require("./../../../assets/logo-filled.png")} alt={"JAI"} title={"JAI"} />
        <span className=" ms-fontWeight-light ms-fontColor-neutralPrimary mb-1">Your Api Key: {apiKey}</span>
        <span className=" ms-fontWeight-light ms-fontColor-neutralPrimary mb-1">
          Current Environment: {selectedEnvironment}
        </span>
      </section>
    );
  }
}
