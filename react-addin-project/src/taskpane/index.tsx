import App from "./components/App";
import {AppContainer} from "react-hot-loader";
import {initializeIcons} from "@fluentui/font-icons-mdl2";
import {ThemeProvider} from "@fluentui/react";
import * as React from "react";
import "./taskpane.css";
import {BrowserRouter} from "react-router-dom";
import {createRoot} from "react-dom/client";

/* global document, Office, module, require */

initializeIcons();

let isOfficeInitialized = false;

const title = "JAI";

const render = (Component) => {
  const container = document.getElementById("container");
  const root = createRoot(container!);

  root.render(
    <BrowserRouter>
      <AppContainer>
        <ThemeProvider>
          <Component title={title} isOfficeInitialized={isOfficeInitialized} />
        </ThemeProvider>
      </AppContainer>
    </BrowserRouter>
  );
};

/* Render application after Office initializes */
Office.onReady(() => {
  isOfficeInitialized = true;
  render(App);
});

if ((module as any).hot) {
  (module as any).hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    render(NextApp);
  });
}
