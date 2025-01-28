import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import "@/styles/global.scss";
import "@/styles/typography.scss";
import "@/styles/utility.scss";
import "@/styles/layout.scss";
import "@/index.css";

import App from "./App.jsx";
import store from "./store/index.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
