import * as Axios from "axios";
import { BrowserWindow, ipcRenderer } from "electron";
import * as React from "react";

const { ConnectionBuilder } = require("electron-cgi");
const urlStart = "https://almoctane-eur.saas.microfocus.com/api/shared_spaces/146003/workspaces/";

export class ApiUtil {

    // -----------------------------get octane details ------------------------------
    public static getWorkspaceId(response: any) {
        const url = urlStart;
        if (response === undefined || response === null) {
            ApiUtil.Get(url, ApiUtil.getWorkspaceId);
        } else {
            // pull out id
            const id = JSON.parse(response.responseText).data[0].id;
            ipcRenderer.send("cSharp", { target: "details", data: { property: "WorkspaceId", value: id } });
        }
    }

    public static getUserId(response: any, listener: string) {
        const url = urlStart + "1002/workspace_users";
        if (response === undefined || response === null) {
            ApiUtil.Get(url, ApiUtil.getUserId, listener);
        } else {
            // pass response to c# to pull out the desired ID
            const Data = { target: "findUserId", data: response.responseText };
            ipcRenderer.send("cSharp", { source: listener, target: "user", data: Data });
        }
    }

    public static getAllTasks(response: any, userId?: string, offset?: string) {
        // get all the tasks but just with owner details and phase
        let url = urlStart + "1002/tasks?fields=owner,phase&limit=9000";
        if (offset !== undefined && offset !== null) {
            url = url + "&offset=" + offset;
        }
        if (response === undefined || response === null) {
            ApiUtil.Get(url, ApiUtil.getAllTasks, userId, offset);
        } else {
            // Pull out all the tasks with the user as the owner.
            // pass that info the c# and then start getting full details for each task
            // pass the full details to C# where it can save them.
            // fetch each task detail from C#
            const responseObject = JSON.parse(response.responseText);
            if (responseObject.data != null) {
                const Data = { target: "filterOwnerTasks", data: response.responseText };
                ipcRenderer.send("cSharp", { source: "userTasks", target: "task", data: Data });
                // need to run the API call again and offset the results by 20000 to get the next set of tasks
                const totalNumberOfTasks = responseObject.total_count;
                if (offset === undefined || offset === null) {
                    offset = "0";
                }
                if (Number(totalNumberOfTasks) > (Number(offset) + responseObject.data.length)) {
                    offset = String(Number(offset) + 9000);
                    ApiUtil.getAllTasks(null, userId, offset);
                } else {
                    // all tasks have been loaded so signal that here
                    ipcRenderer.send("balloon", { "title": "Tasks", "contents": totalNumberOfTasks + " Retrieved" });
                    // get the list of active tasks 


                }

            }
        }
    }

    public static getTaskDetails(response: any, taskId: string) {
        let url = urlStart + "/1002/tasks/" + taskId;
        if (response === null || response === undefined) {
            ApiUtil.Get(url, this.getTaskDetails);
        } else {
            // pull out task details in this api then pass the details to c# for storage. To save on rendering time
            const taskToAdd = JSON.parse(response.responseText);

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
    public static retrieve(property: string, RequestSource: string) {
        ipcRenderer.on("retrieveFromStore", this.returnToSender);
        ipcRenderer.send("cSharp", { source: "retrieveFromStore", target: "retrieve", data: { target: property } });
    }

    private static returnToSender = (event: any, value: any) => {
        const whatCameBack = value;
    }
    // -----------------------------get things from store ------------------------------


    // -----------------------------HTTP methods------------------------------

    private static Get(url: string, after: any, extra?: any, extra2?: any) {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                after(xmlHttp, extra, extra2);
            }
        };
        xmlHttp.open("GET", url, true); // true for asynchronous
        xmlHttp.send(null);
    }
    private static Put(url: string, data: any) {
        let answer = null;
        Axios.default.put(url, data).then((response) => {
            answer = response.data;
            return answer;
        });
    }

}
