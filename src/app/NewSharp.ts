import { app, remote } from "electron";
import * as fs from "fs";
// tslint:disable-next-line: max-classes-per-file
export class NewSharp {
    private path = app.getAppPath();
    private Logger = new Logger(this.path + "\\log.log");
    private Details = new Details(this.path, this.Logger);
    private Tasks = new Tasks(this.Logger, this.Details);

    public route = (target: string, data: any) => new Promise<any>(() => {
        switch (target) {
            case "details": {
                return this.Details.route(data);
            }
            case "tasks": {
                return this.Tasks.route(data);
            }
        }
    })
}

// tslint:disable-next-line: max-classes-per-file
class Details {
    private dataStore = new Map<string, string>();
    private userList = new Map<string, any>();
    private userCache = "";
    private Logger: Logger;


    constructor(Path: string, logger: Logger) {
        this.userCache = Path + "\\userDetails.txt";
        this.Logger = logger;
    }

    public route = (data: any) => new Promise<any>(() => {
        const target = data.target;
        switch (target) {
            case "update": {
                return this.update(data);
            }
            case "retrieve": {
                return this.retrieve(data.data.target);
            }
            case "loadFile": {
                return this.loadFromFile();
            }
            case "userList": {
                return this.getUserDetails(data);
            }
        }
    })

    public getUserDetails = (data: any) => new Promise<any>(() => {
        this.Logger.Log("In getUserDetails");
        if (data.data.operation === "update") {
            // update user details here
        } else if (data.data.operation === "retrieve") {
            return this.userList.get(data.data.target);
        }
    })

    public update = (data: any) => new Promise<any>(() => {
        this.Logger.Log("In update");
        this.dataStore.set(data.data.target, data.data.value);
        this.saveDetails();
    })

    public retrieve = (data: string) => new Promise<any>(() => {
        this.Logger.Log("In retrieve");
        return this.dataStore.get(data);
    })

    public loadFromFile = () => {
        this.Logger.Log("In loadFromFile");
        if (fs.existsSync(this.userCache)) {
            const raw = fs.readFileSync(this.userCache, "utf-8");
            while (raw === "") {
                // nothing
            }
            const properties = raw.split(",");

            for (const prop of properties) {
                if (prop !== "") {
                    const contents = prop.split(":");
                    this.dataStore.set(contents[0], contents[1]);
                }
            }
        } else {
            this.saveDetails();
        }
    }

    private saveDetails() {
        this.Logger.Log("In saveDetails");
        let text = "";
        for (const key of this.dataStore.keys()) {
            text = text + key + ":" + this.dataStore.get(key) + ",";
        }
        fs.writeFileSync(this.userCache, text);
    }
}

// tslint:disable-next-line: max-classes-per-file
class Logger {
    public shouldLog = false;
    private logPath = "";

    constructor(LogPath: string) {
        this.logPath = LogPath;
    }

    public Log = (contents: string) => {
        const time = Date.now().toLocaleString();
        const log = time + "\t--\t" + contents;
        if (this.shouldLog) {
            if (fs.existsSync(this.logPath)) {
                fs.appendFileSync(this.logPath, log);
            } else {
                fs.writeFileSync(this.logPath, log);
            }
        }
    }
}

// tslint:disable-next-line: max-classes-per-file
class Tasks {
    private Logger: Logger;
    private Store: Details;
    private allTasks = new Map<string, any>(); // map of all returned tasks
    private userTasks = new Map<string, any>(); // map of only the users tasks. But ALL the detail
    private userTaskList = new Array(); // array of JUST the task ids for the user
    private NumberOfTasks = 0;

    constructor(logger: Logger, store: Details) {
        this.Logger = logger;
        this.Store = store;
    }

    public route(data: any) {
        const target = data.target;
        switch (target) {
            case "filterOwnerTasks":
                return this.filterOwnerTasks(data.data);
            // case "returnTaskList":
            //     return taskList;
            // case "totalNumberOfTasks":
            //     NumberOfTasks = Convert.ToInt32(data.data.ToString());
            //     break;
            // case "taskDetails":
            //     return taskDetails(data.data);
            default:
                this.Logger.Log("tasks: no route found for " + target);
                break;
        }
    }

    public filterOwnerTasks = (data: any) => {
        const taskJson = data.data.Tasks;
        const taskObjects = JSON.parse(taskJson);
        const userId = this.Store.retrieve("USERID");

        for (const task of taskObjects.data) {
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
