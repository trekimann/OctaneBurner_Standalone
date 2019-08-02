import { ipcRenderer } from "electron";
import * as React from "react";
import { ApiUtil } from "./../ApiUtil";
import { Spinner } from "./spinner";
import { Task } from "./Task";

export class Tasks extends React.Component<{}, { TaskRequested: boolean, TasksLoaded: boolean, UserTasksDetails: [] }> {
    // send api request to get all tasks with only owner details
    // use that data to request task specifics for each one
    // create a task object for each one.
    constructor(props: any) {
        super(props);
        this.state = {
            TaskRequested: false,
            TasksLoaded: false,
            UserTasksDetails: [],
        };
    }

    public componentDidMount(): void {
        ipcRenderer.on("allTasks", this.allTasks);
        ipcRenderer.on("userTaskDetails", this.userTaskDetails);
        ApiUtil.getUserId(null, "allTasks");
    }

    public componentWillUnmount(): void {
        ipcRenderer.removeAllListeners("allTasks");
        ipcRenderer.removeAllListeners("userTaskDetails");
    }

    public render() {
        return <div id="tasksContainer">
            {this.state.TasksLoaded ? <div>{(this.state.UserTasksDetails || []).map(value => {
                return <Task key={value.id} Details={value} />;
            })}</div> : <Spinner />}
        </div>;
    }

    private allTasks = (event: any, value: any) => {
        // this should be all the details for the tasks in JSON form
        if (!this.state.TaskRequested) {
            ipcRenderer.send("balloon", { "title": "Tasks", "contents": "Fetching Tasks" });
            ApiUtil.getAllTasks(null, value);
            this.setState({ TaskRequested: true })
        } else {
            // if value is not null then it should be the list of user tasks
            if (value !== null && value !== undefined) {
                // ipcRenderer.send("balloon", { "title": "Tasks", "contents": "Getting " + value + " Task Details" });
                // retrieve list of active tasks for the user
                for (const taskId of value) {
                    ApiUtil.getTaskDetails(null, taskId);
                }
            }
        }
    }

    private userTaskDetails = (event: any, value: any) => {
        // the value is an object containing the details of the task.
        // Use this to make a new task component and add it to the array.
        // Could arrange tasks here by number so the new ones are at the top
        this.setState((state) => {
            const UserTasksDetails = state.UserTasksDetails.concat(value);
            return { UserTasksDetails };
        });
        if (!this.state.TasksLoaded) {
            this.setState({ TasksLoaded: true });
        }
        ipcRenderer.send("balloon", { "title": "Tasks", "contents": "Getting " + value.id + " Task Details" });
    }
}
