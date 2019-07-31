import { ipcRenderer } from "electron";
import * as React from "react";
import { ApiUtil } from "./../ApiUtil";
import { Spinner } from "./spinner";
import { Task } from "./Task";

export class Tasks extends React.Component {
    // send api request to get all tasks with only owner details
    // use that data to request task specifics for each one
    // create a task object for each one.
    constructor(props: any) {
        super(props);
        this.state = {
            TaskRequested: false,
            TasksLoaded: false,
        };
    }

    public componentDidMount(): void {
        ipcRenderer.on("allTasks", this.allTasks);
        ipcRenderer.on("userTaskDetails", this.userTaskDetails);
        ApiUtil.getUserId(null, "allTasks");
        // ipcRenderer.send("balloon", { "title": "Tasks", "contents": "Mounted Tasks" });
    }

    public componentWillUnmount(): void {
        ipcRenderer.removeAllListeners("allTasks");
        ipcRenderer.removeAllListeners("userTaskDetails");
    }

    public render() {
        return <div id="tasksContainer">Tasks go here
        {this.state.TasksLoaded ? <div>Tasks Loaded go here</div> : <Spinner />}
        </div>;
    }

    private allTasks = (event: any, value: any) => {
        // this should be all the details for the tasks in JSON form
        if (!this.state.TaskRequested) {
            ipcRenderer.send("balloon", { "title": "Tasks", "contents": "Fetching Tasks" });
            ApiUtil.getAllTasks(null, value);
            this.setState({ TaskRequested: true })
        } else {
            // retrieve list of active tasks for the user
            ipcRenderer.send("balloon", { "title": "Tasks", "contents": "Getting Task Details" });
            // ApiUtil.getTaskDetails(null,);
        }
    }

    private userTaskDetails = (event: any, value: any) => {

    }
}
