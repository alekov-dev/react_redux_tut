// console.log(`I'm a silly entry point`);

// const arr = [1, 2, 3];
// const iAmJavascriptES6 = () => console.log(...arr);
// window.iAmJavascriptES6 = iAmJavascriptES6;

// import App from "./js/components/App";
// import style from "./main.css";

import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import store from "./js/store/index";
import App from "./js/components/App";
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);

