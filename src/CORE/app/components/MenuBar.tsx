import { ipcRenderer, remote } from "electron";
import * as React from "React";
import octIcon from "../../../modules/burner/app/assets/octaneIcon.png";
// import vidIcon from "../../../modules/videoRecording/app/assets/Video.png";
// import vidIconRec from "../../../modules/videoRecording/app/assets/Video_recording.png";
import closeIcon from "./../assets/close.png";
import maxIcon from "./../assets/maximise.png";
import minIcon from "./../assets/minimise2.png";
import printIcon from "./../assets/Print.png";
import { MenuIcon } from "./MenuIcon";
const { dialog } = require('electron').remote;

const menuStyle = {
  "-webkit-app-region": "drag",
  "backgroundColor": "rgb(64, 64, 64)",
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


export class MenuBar extends React.Component<{}, { Heading?: string, MinOnce: boolean }> {

  // tslint:disable-next-line: member-ordering
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
      click: () => { this.closeWindow(); },
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
      click: () => { this.minWindow(); },
      src: minIcon,
    },
    {
      alt: "Show Devtools",
      click: () => {
        this.openDevTools();
      },
      rightClick: () => {
        window.open("https://almoctane-eur.saas.microfocus.com/", "_blank");
        //     remote.BrowserWindow.getFocusedWindow();
      },
      src: octIcon,
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
    //   click: () => {
    //     ipcRenderer.send("internal", { source: "toggleIcon" + "Capture Video" });

    //     ipcRenderer.send("window", { target: "createWindow", data: { details: null, filename: "index.html" } });
    //   },
    //   src: vidIcon,
    // },
    {
      alt: "Print. Right click to save PDF",
      click: () => { remote.BrowserWindow.getFocusedWindow().webContents.print({ printBackground: true }); },
      rightClick: () => {
        const fs = require("fs");
        remote.BrowserWindow.getFocusedWindow().webContents.printToPDF(
          { printBackground: true }, (error: any, data: any) => {
            if (error) { throw error; }
            fs.writeFile("/tmp/burner.pdf", data, (error2: any) => {
              if (error2) { throw error2; }
              this.balloon("Print", "Print to PDF complete");
              // console.log("WritePDF success");
            });
          });
      },
      src: printIcon,
    },
  ];


  constructor(props: any) {
    super(props);
    this.state = {
      Heading: "Octane Burner",
      MinOnce: false,
    };
  }

  public componentDidMount() {
    // listen for updates on tasking here
    ipcRenderer.on("updateTimedTask", this.taskUpdate);
  }


  public loginWindow() {
    window.open("https://login.software.microfocus.com/msg/actions/showLogin", "_blank");
  }

  public minWindow = () => {
    remote.BrowserWindow.getFocusedWindow().minimize();
    if (!this.state.MinOnce) {
      this.balloon("Notificaiton", "Still Running in system tray");
      this.setState({ MinOnce: true });
    }
  }

  public closeWindow = () => {


    // check if a task is running
    // if there is, notify the user to stop manually
    if (this.state.Heading !== "Octane Burner") {
      // TODO: Make it stop task automatically
      this.balloon("Warning", "A task is being tracked. Stop tracking before quiting");
    } else {
      // if no task then ask to quit the app
      const options = {
        buttons: ["Yes", "No"],
        message: "Do you really want to quit?"
      };
      const response = dialog.showMessageBoxSync(options);
      switch (response) {
        case 0: {
          remote.BrowserWindow.getFocusedWindow().close();
        }
      }
    }
  }

  public maxWindow() {
    const window = remote.BrowserWindow.getFocusedWindow();
    window.isMaximized() ? window.restore() : window.maximize();
  }

  public render(): React.ReactNode {
    return <header style={menuStyle}>{this.state.Heading}
      <nav style={navStyle}>
        <ul style={ulStyle}>
          {this.buttons.map((value: any, index) => {
            return <MenuIcon key={value.alt}
              imgSrc={value.src}
              onClick={() => value.click()}
              liStyle={value.liStyle}
              buttonStyle={value.buttonStyle}
              altText={value.alt}
              altSrc={value.altSrc}
              rightClick={() => value.rightClick()}
            />;
          })}
        </ul>
      </nav>
    </header>;
  }

  private openDevTools = () => {
    remote.BrowserWindow.getFocusedWindow().webContents.openDevTools();
  }

  private balloon = (Title: string, Contents: string) => {
    ipcRenderer.send("balloon", { title: Title, contents: Contents });
  }

  private taskUpdate = (event: any, task: any) => {
    let textToShow = "Octane Burner";
    if (task !== null && task !== undefined && task !== "none") {
      textToShow = "Task " + task + " tracking";
    }
    this.setState({ Heading: textToShow });
  }
}
