import * as React from "react";
import Progress from "./Progress";
import "@coreui/coreui/dist/css/coreui.min.css";
import {AuthenticationContext, defaultContext} from "../../hoc/AuthenticationContext";
import {OperationKeys} from "../../operations/operations";

import ApiKeyForm from "./children/ApiKeyForm";
import EnvironmentSelectionForm from "./children/EnvironmentSelectionForm";
import AuthenticatedHeader from "./AuthenticatedHeader";
import AnonymousHeader from "./AnonymousHeader";
import {setEnvironment} from "jai-sdk";
import OperationsForm from "./children/OperationsForm";
import SimilarById from "./children/panels/SimilarById";
import Recommendation from "./children/panels/Recommendation";
import Prediction from "./children/panels/Prediction";

const logo = require("./../../../assets/logo-filled.png");

const stateStorageKey = "state";

export interface AppProps {
    title: string;
    isOfficeInitialized: boolean;
}

const initialState = {
    ...defaultContext,
    operation: null
};

export default class App extends React.Component<AppProps> {
    state = {
        ...initialState
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

        const {environmentName} = this.state;

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
        return !this.isApiKeySet();
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

    logoff = () => {
        this.setState(initialState, () => this.storeState());
    };

    render() {
        const {title, isOfficeInitialized} = this.props;

        if (!isOfficeInitialized) {
            return <Progress title={title} logo={logo} message="Please sideload your addin to see app body."/>;
        }

        return (
            <AuthenticationContext.Provider value={this.state}>
                <div className="ms-welcome">

                    {this.isAnonymousUser() && (
                        <AnonymousHeader></AnonymousHeader>
                    )}

                    {!this.isAnonymousUser() && (
                        <AuthenticatedHeader onLogoff={() => this.logoff()}></AuthenticatedHeader>
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

                    {this.state.operation === OperationKeys.SimilarityById &&
                        <SimilarById></SimilarById>
                    }

                    {this.state.operation === OperationKeys.Recommendation &&
                        <Recommendation></Recommendation>
                    }

                    {this.state.operation === OperationKeys.Prediction &&
                        <Prediction></Prediction>
                    }

                </div>
            </AuthenticationContext.Provider>


        );
    }
}
