import * as React from "react";
import { DefaultButton } from "@fluentui/react";
import Header from "./Header";
import HeroList, { HeroListItem } from "./HeroList";
import Progress from "./Progress";
import { authenticate, getEnvironments, getDatabaseInfo, setEnvironment } from "jai-sdk";
import {CForm, CFormInput} from "@coreui/react";
import '@coreui/coreui/dist/css/coreui.min.css'
import {useState} from "react";

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
  apiKey: string;
}

export interface AppState {
  listItems: HeroListItem[];

}

export default class App extends React.Component<AppProps, AppState> {
  isAuthenticated: boolean = false;
  environments = [];

  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [],
    };
  }

  componentDidMount() {
    this.setState({
      listItems: [
        {
          icon: "Ribbon",
          primaryText: "Achieve more with Office integration",
        },
        {
          icon: "Unlock",
          primaryText: "Unlock features and functionality",
        },
        {
          icon: "Design",
          primaryText: "Create and visualize like a pro",
        },
      ],
    });
  }

  authenticate = async () => {
    try {
      console.log("authenticate")
      if (!this.props.apiKey) {
        return;
      }
      authenticate(this.props.apiKey);

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
  
  const handleChange = (e) => setValue(e.target.value);

  handleSubmit = async (event) =>  {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }

    await this.authenticate()
    event.preventDefault()
    // setValidated(true)
  }

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

        <CForm className={"p-3"}
               noValidate
               onSubmit={this.handleSubmit}>
          <CFormInput
              required
              className={"mb-2"}
              label="Insert your Api Key"
              placeholder="Api Key"
              value={this.props.apiKey}
              onChange={}
          />
          <DefaultButton className="ms-welcome__action" type={"submit"} >
            Access
          </DefaultButton>
        </CForm>


{/*        <HeroList message="Discover what Office Add-ins can do for you today!" items={this.state.listItems}>
        </HeroList>*/}
      </div>
    );
  }
}
