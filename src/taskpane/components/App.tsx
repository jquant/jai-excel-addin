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
    showApiKeyForm: true,
    showEnvironmentsSelectionForm: false,
    showCollectionsForm: false,
  };

  authenticatedCallback() {
    this.setState({
      ...this.state,
      showApiKeyForm: false,
      showEnvironmentsSelectionForm: true,
      showCollectionsForm: false,
    });
  }

  environmentSelected() {
    this.setState({
      ...this.state,
      showApiKeyForm: false,
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
        {this.state.showApiKeyForm && <ApiKeyForm onAuthenticated={() => this.authenticatedCallback()}></ApiKeyForm>}

        {this.state.showEnvironmentsSelectionForm && (
          <EnvironmentSelectionForm onEnvironmentSelected={() => this.environmentSelected()}></EnvironmentSelectionForm>
        )}

        {this.state.showCollectionsForm && <CollectionsForm></CollectionsForm>}
      </div>
    );
  }
}
