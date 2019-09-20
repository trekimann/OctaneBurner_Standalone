// tslint:disable: no-var-requires
const url = require("url");
// const os = require("os");
const path = require("path");
const iconpath = path.join(__dirname + "/assets", "octaneIcon.png");
import { app, BrowserWindow, ipcMain, Menu, nativeImage, Tray } from "electron";
import { UtilRouter } from "./app/UtilRouter";
import { WindowControl } from "./app/WindowManager";

let newSharp: UtilRouter;
const control = new WindowControl();
let mainWindowId: number;

const createMainWindow = () => {
  mainWindowId = control.createNewWindow({
    frame: false,
    height: 600,
    icon: iconpath,
    minWidth: 340,
    webPreferences: {
      nodeIntegration: true,
    },
    width: 340,
  });

  control.navigateTo(mainWindowId,
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true,
    }),
  );

  control.getWindow(mainWindowId).on("minimize", (event: any) => {
    event.preventDefault();
    control.getWindow(mainWindowId).hide();
  });

  // window = control.getWindow(mainWindowId);
  createTray();

  // BrowserWindow.addDevToolsExtension(
  // BrowserWindow.removeDevToolsExtension(
  //   path.join(os.homedir(),
  //   "AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.0.6_0"));

  newSharp = new UtilRouter();
  newSharp.route("details", { target: "loadFile", data: "" });
  // reset any values which could cause problems
  newSharp.route("details", {
    property: "ACTIVETASK", target: "update", value: "none",
  });

};

const quit = () => {
  // check if a task is running
  const task = newSharp.route("details", { target: "retrieve", data: { target: "ACTIVETASK" } });
  // if there is, notify the user to stop manually
  if (task !== "none" && task !== null) {
    // TODO: Make it stop task automatically
    balloon("Warning", "A task is being tracked. Stop tracking before quiting");
  } else {
    // if no task then quit the app
    app.quit();
  }
};

let appIcon: Tray = null;
let lastBalloonMessage = "";
const createTray = () => {
  appIcon = new Tray(nativeImage.createFromPath(iconpath).resize({ width: 16, height: 16 }));

  const contextMenu = Menu.buildFromTemplate([{
    label: "Show",
    click() {
      control.getWindow(mainWindowId).show();
    },
  },
  {
    label: "Quit",
    click() {
      quit();
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
  appIcon.on("double-click", () => { control.getWindow(mainWindowId).show(); });
  appIcon.on("balloon-click", () => { control.getWindow(mainWindowId).show(); });
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

app.on("ready", createMainWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (window === null) {
    createMainWindow();
  }
});

ipcMain.on("balloon", (event: any, arg: any) => {
  balloon(arg.title, arg.contents);
});


// Handle requests from React
ipcMain.on("tsUtil", (event: any, arg: any) => {

  new Promise((resolve, reject) => {
    const answer = newSharp.route(arg.target, arg.data);
    if (answer !== undefined) {
      resolve(answer);
    } else {
      reject(undefined);
    }
  }).then((res) => {
    // console.log("I was called successfully");
    // console.log(res);
    if (arg.source !== undefined && arg.source !== null) {
      control.getWindow(mainWindowId).webContents.send(arg.source, res);
    }
  }).catch((res) => {
    // tslint:disable: no-console
    console.log("I was not called successfully");
    console.log(res);
    console.log(arg.target);
    console.log(arg.data);
  });
});

// handle requests from react to react
ipcMain.on("internal", (event: any, arg: any) => {
  control.getWindow(mainWindowId).webContents.send(arg.source, arg.data);
});

// -------------------------------------- Util Class ------------------------------------
