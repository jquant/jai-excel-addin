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

const stateStorageKey = "state";

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export default class App extends React.Component<AppProps> {
  state = {
    ...defaultContext,
    operation: null
  };

  componentDidMount() {
    const storedState = localStorage.getItem(stateStorageKey);
    if (storedState) {
      this.setState({
        ...this.state,
        ...JSON.parse(storedState)
      });
    }
  }

  setJaiKeysFromState = () => {

    const { apiKey, environmentName } = this.state;

    if (apiKey) {
      authenticate(apiKey);
    }

    if (environmentName) {
      setEnvironment(environmentName);
    }
  };

  storeState = () => {
    localStorage.setItem(stateStorageKey, JSON.stringify(this.state));
  };

  setApiKey = (apiKey) => {
    this.setState({
      ...this.state,
      apiKey
    }, () => {
      this.storeState();
      this.setJaiKeysFromState();
    });
  };

  setEnvironmentName = (environmentName) => {
    this.setState({
      ...this.state,
      environmentName
    }, () => {
      this.storeState();
      this.setJaiKeysFromState();
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
    }, () => {
      this.storeState();
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
            <OperationsForm
              selectedValue={this.state.operation}
              onOperationSelected={(operation) => this.setOperation(operation)}></OperationsForm>
          )}

        </div>
      </AuthenticationContext.Provider>


    );
  }
}
