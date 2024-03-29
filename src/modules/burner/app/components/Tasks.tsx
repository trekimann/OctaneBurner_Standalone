import { ipcRenderer } from "electron";
import * as React from "React";
import { ApiUtil } from "../../Util/ApiUtil";
import { Spinner } from "./Spinner";
import { Story } from "./Story";

export class Tasks extends React.Component<{ UserId: string }, {
    TaskRequested: boolean,
    TaskInProgress: string,
    TasksLoaded: boolean,
    UserTasksDetails: [],
    GroupedTasks: {},
    UserId: string,
}> {
    // send api request to get all tasks with only owner details
    // use that data to request task specifics for each one
    // create a task object for each one.
    constructor(props: any) {
        super(props);
        this.state = {
            GroupedTasks: {},
            TaskInProgress: "none",
            TaskRequested: false,
            TasksLoaded: false,
            UserId: "",
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

    public updateTimedTask = (task: string) => {
        if (task === undefined || task === null) {
            return this.state.TaskInProgress;
        } else {
            this.setState({ TaskInProgress: task });
            // broadcast the task details for other components
            const arg = { source: "updateTimedTask", data: task };
            ipcRenderer.send("internal", arg);
            // update store with info so it can be looked up in the future
            ipcRenderer.send("tsUtil",
                { target: "details", data: { target: "update", property: "ActiveTask", value: task } });

        }
    }

    public render() {
        return <div id="tasksContainer">
            {this.state.TasksLoaded ? <React.Fragment>
                {Object.keys(this.state.GroupedTasks).reverse().map((story) => {
                    return <Story key={story}
                        StoryId={story}
                        LinkedTasks={this.state.GroupedTasks[story]}
                        TaskInFlight={this.updateTimedTask}
                        userId={this.state.UserId} />;
                })}
            </React.Fragment> : <Spinner />}
        </div>;
    }

    private allTasks = (event: any, value: any) => {
        // this should be all the details for the tasks in JSON form
        if (!this.state.TaskRequested) {
            this.balloon("Tasks", "Fetching Tasks");
            ApiUtil.getAllTasks(null, value);
            this.setState({ TaskRequested: true, UserId: value });
        } else {
            // if value is not null then it should be the list of user tasks
            if (value !== null && value !== undefined) {
                // retrieve list of active tasks for the user
                value.sort();
                for (const taskId of value) {
                    ApiUtil.getTaskDetails(null, taskId);
                }
            } else {
                this.balloon("Error", "No Tasks in your name found");
            }
        }
    }

    private userTaskDetails = (event: any, value: any) => {
        // the value is an object containing the details of the task.
        // Use this to make a new task component and add it to the array.
        // TODO: look at a timer to update tasks automaticaly
        if (!(this.state.UserTasksDetails.filter((t: any) => t.id === value.id).length > 0)) {
            this.setState((state: any) => {
                // cant mutate state so need to replace it
                const UserTasksDetails = state.UserTasksDetails.concat(value);
                UserTasksDetails.sort((a: any, b: any) => {
                    return Number(a.id) < Number(b.id);
                });
                return { UserTasksDetails };
            });

            // group the tasks here by story to be able to make stories as the top level
            const grouped = this.state.GroupedTasks;
            const storyId = value.story.id;
            // if the story isnt in the gorouping yet, add it.
            if (grouped[storyId] === null || grouped[storyId] === undefined) {
                grouped[storyId] = [value];
            } else {
                // if it is, add it
                const tasks = grouped[storyId];
                tasks.push(value);
            }
            this.setState({ GroupedTasks: grouped });

            if (!this.state.TasksLoaded) {
                this.setState({ TasksLoaded: true });
            }
            this.balloon("Tasks", "Getting " + value.id + " Task Details");
        }
    }

    private balloon = (t: string, c: string) => {
        ipcRenderer.send("balloon",
            {
                contents: c,
                title: t,
            });
    }
}
