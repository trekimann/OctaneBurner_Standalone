import * as React from "React";
import * as ReactDOM from "react-dom";
// import { ParentBurner } from "../../modules/burner/app/components/ParentBurner";
import { MenuBar } from "./Components/MenuBar";
import {AppParent} from "./Components/Parent";
// import {VideoCapture} from "./components/VideoCapture";

ReactDOM.render(<MenuBar />, document.getElementById("menuBar"));
ReactDOM.render(<AppParent/>, document.getElementById("ApplicationContainer"));
// ReactDOM.render(<VideoCapture/>, document.getElementById("renderer"));
