import React from "react";
import { render } from "react-dom";
import Switch from "app/Switch";// eslint-disable-line import/no-unresolved

const app = document.getElementById("app");

// ****FOR DEV****
window.applicationRootPath = "/";
window.backendRootPath = "http://192.168.1.74:8080/grave/";


render((<Switch />), app);
