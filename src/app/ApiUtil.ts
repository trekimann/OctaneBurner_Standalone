import * as Axios from "axios";
import { BrowserWindow, ipcRenderer } from "electron";
import * as React from "react";

const { ConnectionBuilder } = require("electron-cgi");
const urlStart = "https://almoctane-eur.saas.microfocus.com/api/shared_spaces/146003/workspaces";

let state = {
    workspaceId: "",
};

export class ApiUtil {
    // -----------------------------get octane details ------------------------------
    public static getWorkspaceId(response: any) {
        const url = urlStart;
        if (response === undefined || response === null) {
            ApiUtil.Get(url, ApiUtil.getWorkspaceId, null);
        } else {
            // pull out id
            const id = JSON.parse(response.responseText).data[0].id;
            ipcRenderer.send("cSharp", { target: "details", data: { property: "WorkspaceId", value: id } });
            state.workspaceId = id;
        }
    }

    public static getTasks(response: any) {
        // get all the tasks but just with owner details
        const url = urlStart + "/" + state.workspaceId + "/tasks?fields=owner&limit=20000";
        if (response === undefined || response === null) {
            ApiUtil.Get(url, ApiUtil.getTasks, null);
        } else {
            // pass response to c# to pull out the desired tasks
            ipcRenderer.send("cSharp", {source: "userTasks", target: "task", data: response });
        }

    }
    // -----------------------------get octane details ------------------------------

    // -----------------------------put things into octane ------------------------------
    public static updateTask(update: any) {
        const task = update.taskId;
        const url = urlStart + state.workspaceId + "/tasks/" + task;
        ApiUtil.Put(url, update.data);
    }
    // -----------------------------put things into octane ------------------------------


    // -----------------------------put things into store ------------------------------
    public static updateUsername(username: string) {
        this.updateToBack({ property: "Username", value: username });
    }

    public static updateToBack(update: any) {
        ipcRenderer.send("cSharp", { target: "details", data: update });
    }
    // -----------------------------put things into store ------------------------------


    // -----------------------------get things from store ------------------------------
    public static retrieve(property: string, source: string) {
        // ipcRenderer.on("retrieveFromStore", this.returnToSender(source,));
        ipcRenderer.send("cSharp", { source: "retrieveFromStore", target: "retrieve", data: { target: property } });
    }

    private static returnToSender(sender: string, toReturn: string, localListener: string) {

    }
    // -----------------------------get things from store ------------------------------


    // -----------------------------HTTP methods------------------------------
    public static Get(url: string, after: any, extra: any) {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                after(xmlHttp, extra);
            }
        };
        xmlHttp.open("GET", url, true); // true for asynchronous
        xmlHttp.send(null);
    }
    public static Put(url: string, data: any) {
        let answer = null;
        Axios.default.put(url, data).then((response) => {
            answer = response.data;
            return answer;
        });
    }

}
