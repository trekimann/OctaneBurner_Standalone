const url = require("url");
const path = require("path");
const { ConnectionBuilder } = require("electron-cgi");
const iconpath = path.join(__dirname + "/assets", 'octaneIcon.png');
import { app, BrowserWindow, Tray, Menu, nativeImage } from "electron";

let window: BrowserWindow | null;

const createWindow = () => {
  window = new BrowserWindow({
    frame: false,
    height: 600,
    icon: iconpath,
    minWidth: 334,
    webPreferences: {
      nodeIntegration: true,
    },
    width: 334,
  });

  window.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true,
    }),
  );

  window.on("closed", () => {
    window = null;
  });

  window.on("minimize", (event) => {
    event.preventDefault()
    window.hide();
  });

  createTray();
};


let appIcon = null;
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
      app.isQuiting = true;
      app.quit();
    },
  },
  ]);

  appIcon.setContextMenu(contextMenu);
  appIcon.setToolTip("Octane Burner");
  appIcon.on("double-click", () => { window.show(); });
  appIcon.on("balloon-click", () => { window.show(); });
  appIcon.setHighlightMode('always');
}

function balloon(displayTitle, contents) {
  appIcon.displayBalloon({ title: displayTitle, content: contents });
}

const connection = new ConnectionBuilder()
  .connectTo("dotnet", "run", "--project", "./core/Core")
  .build();

connection.onDisconnect = () => {
  console.log("lost");
};

connection.send("greeting", "Mom from C#", (response: any) => {
  window.webContents.send("greeting", response);
  connection.close();
});

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