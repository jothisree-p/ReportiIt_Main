import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { installAppPopups } from "./appPopups";

import { BrowserRouter } from "react-router-dom";

installAppPopups();

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
