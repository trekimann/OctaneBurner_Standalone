import { BrowserWindow, ipcRenderer } from "electron";
const { ConnectionBuilder } = require("electron-cgi");

export class CommBridge {
    public window: BrowserWindow | null;
    private ipc = ipcRenderer;
    constructor(window: BrowserWindow) {
        this.window = window;
    }

    public sendtoMain(reqFunction: string, contents: any) {
        let connection = new ConnectionBuilder()
        .connectTo("dotnet", "run", "--project", "./core/Core")
        .build();

        connection.send(reqFunction, contents, (response: any) => {
            window.webContents.send(reqFunction, response);
            connection.close();
        });
    }
}
