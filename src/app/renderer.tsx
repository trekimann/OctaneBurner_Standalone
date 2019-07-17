import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {Dashboard} from "./components/Dashboard";
import {MenuBar} from "./components/MenuBar";

ReactDOM.render(<Dashboard />, document.getElementById('renderer'));
ReactDOM.render(<MenuBar />, document.getElementById('menuBar'));