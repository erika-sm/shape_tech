import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { StoreProvider } from "./components/StoreContext";

ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,

  document.getElementById("root")
);
