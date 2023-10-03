import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ViewCity from "./ViewCity";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ViewCity />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);