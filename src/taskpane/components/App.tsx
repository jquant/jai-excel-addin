import * as React from "react";
import Progress from "./Progress";
import "@coreui/coreui/dist/css/coreui.min.css";
import ApiKeyForm from "./children/ApiKeyForm";
import EnvironmentSelectionForm from "./children/EnvironmentSelectionForm";
import CollectionsForm from "./children/CollectionsForm";
import AuthenticatedHeader from "./AuthenticatedHeader";
import AnonymousHeader from "./AnonymousHeader";
import { defaultContext, AuthenticationContext } from "../../hoc/AuthenticationContext";

const logo = require("./../../../assets/logo-filled.png");

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export default class App extends React.Component<AppProps> {
  state = {
    ...defaultContext,
    showApiKeyForm: true,
    showEnvironmentsSelectionForm: false,
    showCollectionsForm: false
  };

  setApiKey = (apiKey) => {

    console.log('clicked')
    this.setState({
      ...this.state,
      apiKey
    }, () =>console.table(this.state));
  };

  isUserAuthenticated = () => {
    return !this.isAnonymousUser();
  };

  isAnonymousUser = () => {
    return !this.state.apiKey;
  };

  environmentSelected(environment: string) {
    this.setState({
      ...this.state,
      environment,
      showEnvironmentsSelectionForm: false,
      showCollectionsForm: true
    });
  }

  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return <Progress title={title} logo={logo} message="Please sideload your addin to see app body." />;
    }

    return (
      <AuthenticationContext.Provider value={this.state}>
        <div className="ms-welcome">

          Api Key: {this.state.apiKey}

          {this.isAnonymousUser() &&
            <AnonymousHeader></AnonymousHeader>}

          {this.isUserAuthenticated() &&
            <AuthenticatedHeader></AuthenticatedHeader>
          }

          {this.isAnonymousUser() && (
            <React.Fragment>
                <ApiKeyForm onAuthenticated={(apiKey) => this.setApiKey(apiKey)}></ApiKeyForm>
            </React.Fragment>
          )}

          {this.state.showCollectionsForm && (
            <React.Fragment>
              <AuthenticatedHeader
                apiKey={this.state.apiKey}
                selectedEnvironment={this.state.environmentName}></AuthenticatedHeader>
              <CollectionsForm></CollectionsForm>
            </React.Fragment>
          )}
        </div>
      </AuthenticationContext.Provider>


    );
  }
}
