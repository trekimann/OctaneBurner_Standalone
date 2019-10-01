import * as React from "react";
import * as ReactDOM from "react-dom";
import { ParentBurner } from "../../modules/burner/app/components/ParentBurner";
import { MenuBar } from "./components/MenuBar";
import {AppParent} from "./components/Parent";
// import {VideoCapture} from "./components/VideoCapture";

ReactDOM.render(<MenuBar />, document.getElementById("menuBar"));
ReactDOM.render(<AppParent/>, document.getElementById("ApplicationContainer"));
// ReactDOM.render(<VideoCapture/>, document.getElementById("renderer"));
