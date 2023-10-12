import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ViewCity from "./ViewCity";
import { BrowserRouter } from "react-router-dom";

import Profile from "./components/profile";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);