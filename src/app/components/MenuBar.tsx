import * as Electron from "electron";
import { BrowserWindow, ipcRenderer } from "electron";
import * as React from "react";
import { MenuIcon } from "./MenuIcon";
import closeIcon from "./../assets/close.png"
import maxIcon from "./../assets/maximise.png"
import minIcon from "./../assets/minimise2.png"
import octIcon from "./../assets/octaneIcon.png"


const menuStyle = {
  "-webkit-app-region": "drag",
  "background-color": "rgb(65, 64, 64)",
  "color": "white",
  "font-size": "20px",
  "left": 0,
  "min-width": "100%",
  "ms-overflow-style": "scrollbar",
  "padding-left": "10px",
  "padding-top": "2px",
  "position": "fixed",
  "top": 0,
};

const ulStyle = {
  "list-style-type": "none",
  "margin": 0,
  "padding": 0,
};

const navStyle = {
  "float": "right",
  "justify-self": "right",
};


export class MenuBar extends React.Component {
  private buttons = [
    {
      buttonStyle:
      {
        "-webkit-app-region": "no-drag",
        "height": "20px",
        "padding-right": "12px",
        "padding-top": "2px",
      },
      click: this.closeWindow,
      src: closeIcon,
    },
    {
      click: this.maxWindow,
      src: maxIcon,
    },
    ,
    {
      click: this.minWindow,
      src: minIcon,
    },
    {
      click: () => { window.open("https://login.software.microfocus.com/msg/actions/showLogin", "_blank"); },
      // click: this.loginWindow,
      src: octIcon,
    },
  ];

  public loginWindow() {
    var bw = new BrowserWindow({
      frame: true,
    });

    bw.loadURL("https://login.software.microfocus.com/msg/actions/showLogin");
  }

  public minWindow() {
    const { remote } = require("electron");
    remote.BrowserWindow.getFocusedWindow().minimize();
  }
  public alarm() {
    alert("clicked");
  }
  public closeWindow() {
    const { remote } = require("electron");
    remote.BrowserWindow.getFocusedWindow().hide();
    ipcRenderer.send("balloon", { title: "Notificaiton", contents: "Still Running" });
  }

  public maxWindow() {
    const { remote } = require("electron");
    const window = remote.BrowserWindow.getFocusedWindow();
    window.isMaximized() ? window.restore() : window.maximize();
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
