import * as React from "react";
import * as ReactDOM from "react-dom";
import {ParentBurner} from "../../burner/app/components/parent_burner";
import {MenuBar} from "./components/MenuBar";
// import {VideoCapture} from "./components/VideoCapture";

ReactDOM.render(<MenuBar />, document.getElementById("menuBar"));
ReactDOM.render(<ParentBurner/>, document.getElementById("topOptions"));
// ReactDOM.render(<VideoCapture/>, document.getElementById("renderer"));
