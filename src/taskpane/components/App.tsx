import * as React from "react";
import Progress from "./Progress";
import "@coreui/coreui/dist/css/coreui.min.css";
import ApiKeyForm from "./ApiKeyForm";

const logo = require("./../../../assets/logo-filled.png");

export interface AppProps {
    title: string;
    isOfficeInitialized: boolean;
}

export default class App extends React.Component<AppProps> {
    state = {showApiKeyForm: true};

    constructor(props, context) {
        super(props, context);
    }

    authenticatedCallback() {
        this.setState({
            ...this.state,
            showApiKeyForm: false,
        });
    }

    render() {
        const {title, isOfficeInitialized} = this.props;

        if (!isOfficeInitialized) {
            return <Progress title={title} logo={logo} message="Please sideload your addin to see app body."/>;
        }

        return (
            <div className="ms-welcome">
                <ApiKeyForm onAuthenticated={this.authenticatedCallback}></ApiKeyForm>
            </div>
        );
    }
}
