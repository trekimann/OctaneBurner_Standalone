import * as Electron from "electron";
import * as React from "react";
import { MenuIcon } from "./MenuIcon";
import minIcon from "./../assets/minimise.png"

const menuStyle = {
  "-webkit-app-region": "drag",
  "background-color": "rgb(65, 64, 64)",
  "color": "white",
  "left": 0,
  "min-width": "100%",
  "ms-overflow-style": "scrollbar",
  "position": "fixed",
  "top": 0,
  "padding-left": "10px",
  "padding-top": "2px",
};

const ulStyle = {
  "list-style-type": "none",
  "margin": 0,
  "padding": 0,
};

const navStyle = {
  "justify-self": "right",
  "float": "right",
};



export class MenuBar extends React.Component {
  public minWindow() {
    const { remote } = require("electron");
    remote.BrowserWindow.getFocusedWindow().minimize();
  }

  // constructor(props) {
  //   super(props);
  // }
  public render(): React.ReactNode {
    return (<header style={menuStyle}>Octane Burner
      <nav style={navStyle}>
        <ul style={ulStyle}>
          <MenuIcon imgSrc={minIcon} onClick={() => this.minWindow()} />
        </ul>
      </nav>
    </header>);
  }

  // private onMessage = (event: any, message: string) => {
  //   this.setState({ message: message });
  // };
}
