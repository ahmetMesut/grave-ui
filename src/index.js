import React from "react";
import { render } from "react-dom";
import Switch from "app/Switch";// eslint-disable-line import/no-unresolved

const app = document.getElementById("app");

// ****FOR DEV****
window.applicationRootPath = "/grave/ui";
window.backendRootPath = "/grave/";


render((<Switch />), app);
