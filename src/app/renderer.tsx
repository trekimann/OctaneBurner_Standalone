import * as React from "react";
import * as ReactDOM from "react-dom";
import {MenuBar} from "./components/MenuBar";
import {TopOptions} from "./components/TopOptions";
import {VideoCapture} from "./components/VideoCapture";

ReactDOM.render(<MenuBar />, document.getElementById("menuBar"));
ReactDOM.render(<TopOptions/>, document.getElementById("topOptions"));
ReactDOM.render(<VideoCapture/>, document.getElementById("renderer"));
