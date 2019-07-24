import * as Axios from "axios";
import { BrowserWindow, ipcRenderer } from "electron";
import * as React from "react";

const { ConnectionBuilder } = require("electron-cgi");
const urlStart = "https://almoctane-eur.saas.microfocus.com/api/shared_spaces/146003/workspaces";

let state = {
    workspaceId: "",
}

export class ApiUtil {
    public getWorkspaceId() {
        const url = urlStart;
        const response = this.Get(url);
        // pull out id
        const id = response[0].id;
        console.log(id);
        this.updateToBack({ WorkspaceId: id });
        state.workspaceId = id;
    }

    public updateTask(update: any) {
        const task = update.taskId;
        const url = urlStart + state.workspaceId + "/tasks/" + task;
        this.Put(url, update.data);
    }

    public updateUsername(username: string) {
        this.updateToBack({ Username: username });
    }

    private async Get(url: string) {
        const response = await Axios.default.get(url);
        return response;
    }

    private async Put(url: string, data: any) {
        const response = await Axios.default.put(url, data);
        return response.data;
    }

    private updateToBack(update: any) {
        ipcRenderer.send("cSharp", { target: "details", data: update });
    }

}