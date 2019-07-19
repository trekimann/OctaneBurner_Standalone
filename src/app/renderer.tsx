import * as React from "react";
import * as ReactDOM from "react-dom";
import {Dashboard} from "./components/Dashboard";
import {MenuBar} from "./components/MenuBar";
import {TopOptions} from "./components/TopOptions";

ReactDOM.render(<Dashboard />, document.getElementById("renderer"));
ReactDOM.render(<MenuBar />, document.getElementById("menuBar"));
ReactDOM.render(<TopOptions/>, document.getElementById("topOptions"));
