import * as React from "react";
import Progress from "./Progress";
import "@coreui/coreui/dist/css/coreui.min.css";
import ApiKeyForm from "./children/ApiKeyForm";
import EnvironmentSelectionForm from "./children/EnvironmentSelectionForm";
import CollectionsForm from "./children/CollectionsForm";

const logo = require("./../../../assets/logo-filled.png");

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export default class App extends React.Component<AppProps> {
  state = {
    apiKey: "",
    environment: "",
    showApiKeyForm: true,
    showEnvironmentsSelectionForm: false,
    showCollectionsForm: false,
  };

  authenticatedCallback(apiKey: string) {
    this.setState({
      ...this.state,
      apiKey,
      showApiKeyForm: false,
      showEnvironmentsSelectionForm: true,
    });
  }

  environmentSelected(environment: string) {
    this.setState({
      ...this.state,
      environment,
      showEnvironmentsSelectionForm: false,
      showCollectionsForm: true,
    });
  }

  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return <Progress title={title} logo={logo} message="Please sideload your addin to see app body." />;
    }

    return (
      <div className="ms-welcome">
        {this.state.showApiKeyForm && (
          <ApiKeyForm onAuthenticated={(apiKey) => this.authenticatedCallback(apiKey)}></ApiKeyForm>
        )}

        {this.state.showEnvironmentsSelectionForm && (
          <EnvironmentSelectionForm
            onEnvironmentSelected={(environment) => this.environmentSelected(environment)}
          ></EnvironmentSelectionForm>
        )}

        {this.state.showCollectionsForm && (
          <CollectionsForm apiKey={this.state.apiKey} selectedEnvironment={this.state.environment}></CollectionsForm>
        )}
      </div>
    );
  }
}
