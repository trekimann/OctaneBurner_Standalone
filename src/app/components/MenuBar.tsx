import { ipcRenderer, remote } from "electron";
import * as React from "react";
import closeIcon from "./../assets/close.png";
import maxIcon from "./../assets/maximise.png";
import minIcon from "./../assets/minimise2.png";
import octIcon from "./../assets/octaneIcon.png";
import { MenuIcon } from "./MenuIcon";


const menuStyle = {
  "-webkit-app-region": "drag",
  backgroundColor: "rgb(65, 64, 64)",
  color: "white",
  fontSize: "20px",
  left: 0,
  minWidth: "100%",
  "ms-overflow-style": "scrollbar",
  paddingLeft: "10px",
  paddingTop: "2px",
  position: "fixed",
  top: 0,
};

const ulStyle = {
  listStyleType: "none",
  margin: 0,
  padding: 0,
};

const navStyle = {
  float: "right",
  justifySelf: "right",
};


export class MenuBar extends React.Component {
  private buttons = [
    {
      buttonStyle:
      {
        "-webkit-app-region": "no-drag",
        height: "20px",
        paddingRight: "12px",
        paddingTop: "2px",
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
      click: () => {
        window.open("https://login.software.microfocus.com/msg/actions/showLogin", "_blank");
        remote.BrowserWindow.getFocusedWindow().maximize();
      },
      // click: this.loginWindow,
      src: octIcon,
    },
  ];

  public loginWindow() {
    window.open("https://login.software.microfocus.com/msg/actions/showLogin", "_blank");
  }

  public minWindow() {
    remote.BrowserWindow.getFocusedWindow().minimize();
  }
  public alarm() {
    alert("clicked");
  }
  public closeWindow() {
    remote.BrowserWindow.getFocusedWindow().hide();
    ipcRenderer.send("balloon", { title: "Notificaiton", contents: "Still Running" });
  }

  public maxWindow() {
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
