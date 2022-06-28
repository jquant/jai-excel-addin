import * as React from "react";
import Progress from "./Progress";
import "@coreui/coreui/dist/css/coreui.min.css";
import ApiKeyForm from "./children/ApiKeyForm";
import EnvironmentSelectionForm from "./children/EnvironmentSelectionForm";
import CollectionsForm from "./children/CollectionsForm";
import AuthenticatedHeader from "./AuthenticatedHeader";
import AnonymousHeader from "./AnonymousHeader";
import { defaultContext, AuthenticationContext } from "../../hoc/AuthenticationContext";
import { authenticate, setEnvironment } from "jai-sdk";
import OperationsForm from "./children/OperationsForm";

const logo = require("./../../../assets/logo-filled.png");

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export default class App extends React.Component<AppProps> {
  state = {
    ...defaultContext,
    operation: null
  };

  setApiKey = (apiKey) => {
    authenticate(apiKey);
    this.setState({
      ...this.state,
      apiKey
    }, () => console.log("api key set"));
  };

  setEnvironmentName = (environmentName) => {
    setEnvironment(environmentName);
    this.setState({
      ...this.state,
      environmentName
    });
  };

  isAuthenticated = () => {
    return this.isApiKeySet() && this.isEnvironmentSelected();
  };

  isAnonymousUser = () => {
    return !this.isAuthenticated();
  };

  isApiKeySet = () => {
    return this.state.apiKey && this.state.apiKey != "";
  };

  isEnvironmentSelected = () => {
    return !!this.state.environmentName;
  };

  setOperation = (operation) => {
    this.setState({
      ...this.state,
      operation
    });
  };

  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return <Progress title={title} logo={logo} message="Please sideload your addin to see app body." />;
    }

    return (
      <AuthenticationContext.Provider value={this.state}>
        <div className="ms-welcome">

          Api Key: {this.state.apiKey}

          {this.isAnonymousUser() && (
            <AnonymousHeader></AnonymousHeader>
          )}

          {this.isAuthenticated() && (
            <AuthenticatedHeader></AuthenticatedHeader>
          )}

          {!this.isApiKeySet() && (
            <React.Fragment>
              <ApiKeyForm
                onAuthenticated={(apiKey) => this.setApiKey(apiKey)}>
              </ApiKeyForm>
            </React.Fragment>
          )}

          {this.isApiKeySet() && !this.isEnvironmentSelected() && (
            <EnvironmentSelectionForm
              onEnvironmentSelected={(environmentName) => this.setEnvironmentName(environmentName)}>
            </EnvironmentSelectionForm>
          )}

          {this.isAuthenticated() && (
            <OperationsForm onOperationSelected={(operation) => this.setOperation(operation)}></OperationsForm>
          )}

        </div>
      </AuthenticationContext.Provider>


    );
  }
}
