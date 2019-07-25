import * as React from "react";
import { ipcRenderer, remote } from "electron";
import { ApiUtil } from "./../ApiUtil";

export class Tasks extends React.Component {
    // send api request to get all tasks with only owner details
    // use that data to request task specifics for each one
    // create a task object for each one.

    public componentDidUpdate(): void {
        ipcRenderer.on("userTasks", this.taskDetails);
        ApiUtil.getTasks(null);
    }

    public componentWillUnmount(): void {
        ipcRenderer.removeAllListeners("userTasks");
    }

    public render() {
        return <div id="tasksContainer">Tasks go here</div>;
    }
    private taskDetails = (event: any, value: any) => {
        // this should be all the details for the tasks in JSON form
    }
}