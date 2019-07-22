import * as Electron from "electron";
import * as React from "react";
import { MenuIcon } from "./MenuIcon";
import minIcon from "./../assets/minimise.png"
import octIcon from "./../assets/octaneIcon.png"

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
  private buttons = [
    { buttonStyle:
      {
        "-webkit-app-region": "no-drag",
        "height": "15px",
        "padding-right": "12px",
        "padding-top": "2px",
      },
      click: this.closeWindow,
      src: minIcon,
    },
    {
      click: this.minWindow,
      src: minIcon,
    },
    {
      click: () => {window.open("https://login.software.microfocus.com/msg/actions/showLogin", "_blank");},
      src: octIcon,
    },
  ];

  public minWindow() {
    const { remote } = require("electron");
    remote.BrowserWindow.getFocusedWindow().minimize();
  }
  public alarm() {
    alert("clicked");
  }
  public closeWindow() {
    const { remote } = require("electron");
    remote.BrowserWindow.getFocusedWindow().close();
  }

  public render(): React.ReactNode {
    return (<header style={menuStyle}>Octane Burner
      <nav style={navStyle}>
        <ul style={ulStyle}>
          {this.buttons.map((value, index) => {
            return <MenuIcon imgSrc={value.src} onClick={() => value.click()} liStyle={value.liStyle} buttonStyle={value.buttonStyle} />;
          })}
        </ul>
      </nav>
    </header>);
  }
}
