import * as React from "react";

export interface HeaderProps {
  title: string;
  logo: string;
  message: string;
}

export default class Header extends React.Component<HeaderProps> {
  render() {
    const { title, logo, message } = this.props;

    return (
      <section className="ms-welcome__header ms-bgColor-white ms-u-fadeIn500">
        <img width="90" height="70" src={logo} alt={title} title={title} />
        <h1 className="ms-fontSize-su ms-fontWeight-light ms-fontColor-neutralPrimary mb-1">{message}</h1>
      </section>
    );
  }
}