import * as React from "react";
import Header from "./Header";
import Progress from "./Progress";
import { authenticate, getDatabaseInfo, getEnvironments, setEnvironment } from "jai-sdk";
import "@coreui/coreui/dist/css/coreui.min.css";
import { ApiKeyForm } from "./ApiKeyForm";
import { Link } from "react-router-dom";

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export default class App extends React.Component<AppProps> {
  apiKey: string;
  isAuthenticated: boolean = false;
  environments = [];

  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [],
    };
  }

  componentDidMount() {}

  authenticate = async () => {
    try {
      console.log(this.apiKey);
      if (!this.apiKey) {
        return;
      }
      authenticate(this.apiKey);

      this.environments = await getEnvironments();
      console.log(this.environments);

      setEnvironment(null);

      this.isAuthenticated = true;

      console.log(await getDatabaseInfo("complete"));

      console.log(await getDatabaseInfo("names"));
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress
          title={title}
          logo={require("./../../../assets/logo-filled.png")}
          message="Please sideload your addin to see app body."
        />
      );
    }

    return (
      <div className="ms-welcome">
        <Header logo={require("./../../../assets/logo-filled.png")} title={this.props.title} message="Welcome" />
        <Link to="/Herolist">Expenses</Link>
        <ApiKeyForm></ApiKeyForm>
      </div>
    );
  }
}
