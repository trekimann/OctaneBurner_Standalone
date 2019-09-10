import { app, remote } from "electron";
import * as fs from "fs";
// tslint:disable-next-line: max-classes-per-file
export class NewSharp {
    private path = app.getAppPath();
    private Logger = new Logger(this.path + "\\log.log");
    private Details = new Details(this.path, this.Logger);
    private Tasks = new Tasks(this.Logger, this.Details);
    private User = new UserDetails(this.Logger, this.Details);

    constructor() {
    }
    public route = (target: string, data: any) => {
        switch (target) {
            case "details": {
                return this.Details.route(data);
            }
            case "task": {
                return this.Tasks.route(data);
            }
            case "user": {
                return this.User.route(data);
            }
        }
    }
}

// tslint:disable-next-line: max-classes-per-file
class UserDetails {
    private Logger: Logger;
    private Details: Details;

    constructor(log: Logger, deets: Details) {
        this.Logger = log;
        this.Details = deets;
    }

    public route = (data: any) => {
        const target = data.target;
        let toReturn = null;
        switch (target) {
            case "findUserId": {
                toReturn = this.findUserId(this.Details.retrieve("Username"), data.data);
                break;
            }
            case "retrieveUserDetails": {
                toReturn = this.retrieveUserDetails(data.data);
                break;
            }
        }
        return toReturn;
    }

    public retrieveUserDetails = (id: string) => {
        let toReturn = null;
        const userList: Map<string, any> = this.Details.retrieve("userList");
        if (userList.has(id)) {
            toReturn = userList.get(id);
        }
        return toReturn;
    }

    public findUserId = (target: string, userResponse: any) => {
        const userList = new Map<string, object>();

        let toReturn = "";
        // Pull apart the json message from octane into objects.
        const UserInfo = JSON.parse(userResponse);
        const users = UserInfo.data;
        // look though each one for the user who logged in. 
        // while here create in memory list of users. Dictionary with id as key. user object as value
        // tslint:disable-next-line: forin
        for (const person of users) {
            const email = person.email;
            const ID = person.id;
            if (email === target) {
                toReturn = ID;
            }
            userList.set(ID, person);
        }

        // update the data store with the ID
        const update: {
            property: string,
            value: any,
        } = { property: "", value: null };
        update.property = "USERID";
        update.value = toReturn;
        this.Details.update(update);

        update.property = "USERLIST";
        update.value = userList;
        this.Details.update(update);

        // return the userId

        return toReturn;
    }
}

// tslint:disable-next-line: max-classes-per-file
class Details {
    private dataStore = new Map<string, any>();
    private userList = new Map<string, any>();
    private userCache = "";
    private Logger: Logger;


    constructor(Path: string, logger: Logger) {
        this.userCache = Path + "\\userDetails.txt";
        this.Logger = logger;
    }

    public route = (data: any) => {
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
    }

    public getUserDetails = (data: any) => {
        this.Logger.Log("In getUserDetails");
        if (data.data.operation === "update") {
            // update user details here
        } else if (data.data.operation === "retrieve") {
            return this.userList.get(data.data.target);
        }
    }

    public update = (data: any) => {
        this.Logger.Log("In update");
        this.Logger.Log("Property: " + data.property.toUpperCase());
        this.Logger.Log("Value: " + data.value);
        this.dataStore.set(data.property.toUpperCase(), data.value);
        this.saveDetails();
        return true;
    }

    public retrieve = (data: string) => {
        this.Logger.Log("In retrieve");
        this.Logger.Log("Fetching value for: " + data.toUpperCase());
        return this.dataStore.get(data.toUpperCase());
    }

    public loadFromFile = () => {
        this.Logger.Log("In loadFromFile");
        if (fs.existsSync(this.userCache)) {
            const raw = fs.readFileSync(this.userCache, "utf-8");
            if (raw !== "") {
                const properties = raw.split(",");
                if (properties.length > 0) {
                    for (const prop of properties) {
                        if (prop !== "") {
                            const contents = prop.split(":");
                            if (contents[0] === "VERBOSELOGGING") {
                                const log = contents[1].toUpperCase();
                                const logBool = (log === "TRUE");
                                this.Logger.shouldLog = logBool;
                            }
                            this.dataStore.set(contents[0], contents[1]);
                            this.Logger.Log("Loaded: " + contents[0] + "\t-\t" + contents[1]);
                        }
                    }
                }
            }
        } else {
            this.saveDetails();
        }
    }

    private saveDetails() {
        this.Logger.Log("Saving details");
        try {
            this.Logger.Log("In saveDetails");
            let text = "";
            for (const key of this.dataStore.keys()) {
                text = text + key + ":" + this.dataStore.get(key) + ",";
            }
            fs.writeFileSync(this.userCache, text);
        } catch{ }
    }
}

// tslint:disable-next-line: max-classes-per-file
class Logger {
    public shouldLog = false;
    private logPath = "";

    constructor(LogPath: string) {
        this.logPath = LogPath;
        this.Log("Started Application");
    }

    public Log = (contents: string) => {
        try {
            const time = new Date(Date.now()).toLocaleString("en-GB");
            const log = time + "\t--\t" + contents + "\n";
            if (this.shouldLog) {
                if (fs.existsSync(this.logPath)) {
                    fs.appendFileSync(this.logPath, log);
                } else {
                    fs.writeFileSync(this.logPath, log);
                }
            }
        } catch{ }
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
