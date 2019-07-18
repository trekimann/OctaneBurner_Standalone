import * as React from "react";
import * as ReactDOM from "react-dom";
import {Dashboard} from "./components/Dashboard";
import {MenuBar} from "./components/MenuBar";
import {OctaneLogin} from "./components/OctaneLoading";

ReactDOM.render(<OctaneLogin />, document.getElementById("renderer"));
ReactDOM.render(<MenuBar />, document.getElementById("menuBar"));