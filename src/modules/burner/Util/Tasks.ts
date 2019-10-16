import { Logger } from "../../../CORE/Util/Logger";
import { Details } from "./Details";
// tslint:disable-next-line: max-classes-per-file
export class Tasks {
    private Logger: Logger;
    private Store: Details;
    private allTasks = new Map<string, any>(); // map of all returned tasks
    private userTasks = new Map<string, any>(); // map of only the users tasks. But ALL the detail
    private userTaskList = new Array(); // array of JUST the task ids for the user
    private NumberOfTasks = 0;
    constructor(logger: Logger, store: Details) {
        this.Logger = logger;
        this.Store = store;
        this.Logger.Log("Tasks Created");
    }
    public route(data: any) {
        const target = data.target;
        this.Logger.Log("Routing Tasks: " + target);
        switch (target) {
            case "filterOwnerTasks":
                return this.filterOwnerTasks(data.data);
            case "returnTaskList":
                return this.userTaskList;
            case "totalNumberOfTasks":
                this.NumberOfTasks = Number(data.data);
                return true;
            case "taskDetails":
                return this.taskDetails(data.data);
            default:
                this.Logger.Log("tasks: no route found for " + target);
                break;
        }
    }
    public taskDetails = (taskDetails: any) => {
        this.userTasks.set(taskDetails.id, taskDetails);
        return true;
    }
    public filterOwnerTasks = (data: any) => {
        const taskJson = JSON.parse(data);
        const taskObjects = taskJson.data;
        const userId = this.Store.retrieve("USERID");
        for (const task of taskObjects) {
            const owner = task.owner;
            if (!this.allTasks.has(task.id)) {
                this.allTasks.set(task.id, task);
                if (owner != null) {
                    const ownerId = owner.id;
                    if ((ownerId === userId) && !this.userTaskList.includes(task.id) && (task.phase.id !== "phase.task.completed")) {
                        this.userTaskList.push(task.id);
                    }
                }
            }
        }
        if (this.allTasks.size >= this.NumberOfTasks) {
            return this.userTaskList;
        }
    }
}
