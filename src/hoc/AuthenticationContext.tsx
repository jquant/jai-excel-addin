import React from "react";

export type Authentication = {
  apiKey: string;
  environmentName: string;
};

export const defaultContext: Authentication = {
  apiKey: "",
  environmentName: "",
};

export const AuthenticationContext = React.createContext(defaultContext);
