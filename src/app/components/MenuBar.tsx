import { ipcRenderer, remote } from "electron";
import * as React from "react";
import closeIcon from "./../assets/close.png";
import maxIcon from "./../assets/maximise.png";
import minIcon from "./../assets/minimise2.png";
// import octIcon from "./../assets/octaneIcon.png";
// import vidIcon from "./../assets/Video.png";
// import vidIconRec from "./../assets/Video_recording.png";
import printIcon from "./../assets/Print.png";
import { MenuIcon } from "./MenuIcon";

const menuStyle = {
  "-webkit-app-region": "drag",
  "backgroundColor": "rgb(65, 64, 64)",
  "color": "white",
  "fontSize": "20px",
  "left": 0,
  "minWidth": "100%",
  "ms-overflow-style": "scrollbar",
  "paddingLeft": "10px",
  "paddingTop": "2px",
  "position": "fixed",
  "top": 0,
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
      alt: "Close",
      buttonStyle:
      {
        "-webkit-app-region": "no-drag",
        "height": "20px",
        "paddingRight": "12px",
        "paddingTop": "2px",
      },
      click: this.closeWindow,
      src: closeIcon,
    },
    {
      alt: "Maximize",
      click: this.maxWindow,
      src: maxIcon,
    },
    ,
    {
      alt: "Minimize",
      click: this.minWindow,
      src: minIcon,
    },
    // {
    //   alt: "Octane",
    //   click: () => {
    //     window.open("https://almoctane-eur.saas.microfocus.com/ui/?p=146003", "_blank");
    //     remote.BrowserWindow.getFocusedWindow();
    //   },
    //   src: octIcon,
    // },
    // {
    //   alt: "Capture Video",
    //   altSrc: vidIconRec,
    //   src: vidIcon,
    // },
    {
      alt: "Print",
      click: () => { remote.BrowserWindow.getFocusedWindow().webContents.print({ printBackground: true }); },
      src: printIcon,
    },
  ];

  public loginWindow() {
    window.open("https://login.software.microfocus.com/msg/actions/showLogin", "_blank");
  }

  public minWindow() {
    remote.BrowserWindow.getFocusedWindow().minimize();
    ipcRenderer.send("balloon", { title: "Notificaiton", contents: "Still Running in system tray" });
  }

  public closeWindow() {
    remote.BrowserWindow.getFocusedWindow().hide();
    ipcRenderer.send("balloon",
      { title: "Notificaiton", contents: "Still Running. To close fully right click and select quit" });
  }

  public maxWindow() {
    const window = remote.BrowserWindow.getFocusedWindow();
    window.isMaximized() ? window.restore() : window.maximize();
  }

  public render(): React.ReactNode {
    return <header style={menuStyle}>Octane Burner
      <nav style={navStyle}>
        <ul style={ulStyle}>
          {this.buttons.map((value, index) => {
            return <MenuIcon key={value.alt} imgSrc={value.src}
              onClick={() => value.click()} liStyle={value.liStyle}
              buttonStyle={value.buttonStyle} altText={value.alt} />;
          })}
        </ul>
      </nav>
    </header>;
  }

}
