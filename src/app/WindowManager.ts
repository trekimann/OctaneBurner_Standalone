import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
const Path = require("path");
const iconpath = Path.join(__dirname + "/assets", "octaneIcon.png");
const currentWindows: Map<number, BrowserWindow> = new Map();

export class WindowControl {

    public createNewWindow = (windowDetails?: object) => {
        let newWindow: BrowserWindow;
        if (windowDetails === undefined || windowDetails === null) {
            newWindow = new BrowserWindow({
                frame: false,
                height: 600,
                icon: iconpath,
                minWidth: 480,
                webPreferences: {
                    nodeIntegration: true,
                },
                width: 800,
            });
        } else {
            newWindow = new BrowserWindow(windowDetails as BrowserWindowConstructorOptions);
        }

        const windowId = newWindow.id;
        newWindow.on("closed", () => {
            /// #if env == 'DEBUG'
            console.log(`Window was closed, id = ${windowId}`);
            /// #endif

            currentWindows.delete(windowId);
            this.notifyUpdateWindowIDs(windowId);
        });

        // The window identifier can be checked from the Renderer side.
        // `win.loadFile` will escape `#` to `%23`, So use `win.loadURL`
        const filePath = Path.join(__dirname, "index.html");
        newWindow.loadURL(`file://${filePath}#${windowId}`);

        currentWindows.set(windowId, newWindow);
        this.notifyUpdateWindowIDs(windowId);
        return windowId;
    }

    public getWindow = (id: number) => {
        return currentWindows.get(id);
    }

    public navigateTo = (windowId: number, uri: string) => {
        currentWindows.get(windowId).loadURL(uri);
    }

    private notifyUpdateWindowIDs = (excludeId: number) => {
        const windowIds = Array.from(currentWindows.keys());
        currentWindows.forEach((w) => {
            if (w.id === excludeId) {
                return;
            }

            w.webContents.send("UpdateWindowIds", windowIds);
        });
    }
}