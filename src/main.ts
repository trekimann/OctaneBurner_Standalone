const url = require("url");
const path = require("path");
// const os = require("os")
const { ipcMain } = require('electron');
const { ConnectionBuilder } = require("electron-cgi");
const iconpath = path.join(__dirname + "/assets", "octaneIcon.png");
import { app, BrowserWindow, Menu, nativeImage, Tray } from "electron";

let window: BrowserWindow | null;

const createWindow = () => {
  window = new BrowserWindow({
    frame: false,
    height: 600,
    icon: iconpath,
    minWidth: 340,
    webPreferences: {
      nodeIntegration: true,
    },
    width: 340,
  });

  window.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true,
    }),
  );

  window.on("closed", () => {
    connection.close();
    window = null;
  });

  window.on("minimize", (event: any) => {
    event.preventDefault();
    window.hide();
  });

  createTray();

  // BrowserWindow.addDevToolsExtension(
  // BrowserWindow.removeDevToolsExtension(
  //   path.join(os.homedir(),
  //   "AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.0.5_0"));
};

let appIcon: Tray = null;
let lastBalloonMessage = "";
const createTray = () => {
  appIcon = new Tray(nativeImage.createFromPath(iconpath).resize({ width: 16, height: 16 }));

  const contextMenu = Menu.buildFromTemplate([{
    click() {
      window.show();
    },
    label: "Show",
  },
  {
    label: "Quit",
    click() {
      connection.close();
      app.quit();
    },
  },
  {
    label: "Last message",
    click() {
      balloon("Last message", lastBalloonMessage);
    },
  },
  ]);

  appIcon.setContextMenu(contextMenu);
  appIcon.setToolTip("Octane Burner");
  appIcon.on("double-click", () => { window.show(); });
  appIcon.on("balloon-click", () => { window.show(); });
  appIcon.setHighlightMode("always");
};

function balloon(displayTitle: string, contents: string) {
  try {
    appIcon.displayBalloon({ title: displayTitle, content: contents });
    lastBalloonMessage = contents;
  } catch (Exception) {
    appIcon.displayBalloon({ title: "Exception", content: Exception });
  }
}

let connection = new ConnectionBuilder()
  .connectTo("dotnet", "run", "--project", "./core/Core")
  .build();

connection.onDisconnect = () => {
  // tslint:disable-next-line: no-console
  console.log("c# conection lost, retrying connection");
  balloon("Warning", "c# conection lost, retrying connection");
  connectToSharp();
};
function connectToSharp() {
  connection = new ConnectionBuilder()
    .connectTo("dotnet", "run", "--project", "./core/Core")
    .build();
  balloon("Notification", "Reconnected");
  console.log("Reconnected");
}

// connection.send("greeting", "Mom from C#", (response: any) => {
//   window.webContents.send("greeting", response);
// });

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (window === null) {
    createWindow();
  }
});

ipcMain.on("balloon", (event: any, arg: any) => {
  balloon(arg.title, arg.contents);
});


// Handle requests from React for the c# stuff
ipcMain.on("cSharp", (event: any, arg: any) => {
  connection.send(arg.target, arg.data, (response: any) => {
    // balloon("From sharp", response);
    if (arg.source !== undefined && arg.source !== null) {
      window.webContents.send(arg.source, response);
    }
  });
});

// handle requests from react to react
ipcMain.on("internal", (event: any, arg: any) => {
  window.webContents.send(arg.source, arg.data);
});

// -------------------------------------- Util Class ------------------------------------
