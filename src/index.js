import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./components/App";
import ContextProvider from "./context";

ReactDOM.render(
  <ContextProvider>
    <App />
  </ContextProvider>,
  document.getElementById("root")
);
