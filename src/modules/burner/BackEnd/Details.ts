import * as fs from "fs";
import { Logger } from "../../../CORE/Util/Logger";
export class Details {
    private dataStore = new Map<string, any>();
    private userList = new Map<string, any>();
    private userCache = "";
    private Logger: Logger;
    constructor(Path: string, logger: Logger) {
        this.userCache = Path + "\\userDetails.txt";
        this.Logger = logger;
        this.Logger.Log("Deatils created");
    }
    public route = (data: any) => {
        const target = data.target;
        this.Logger.Log("In Details: " + target);
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
                                this.Logger.setLogger(logBool);
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
                const toStore = this.dataStore.get(key).toString();
                if (!toStore.includes("[object") && !key.includes("[object")) {
                    text = text + key + ":" + this.dataStore.get(key) + ",";
                }
            }
            fs.writeFileSync(this.userCache, text);
        } catch {
            // tslint:disable-next-line: no-console
            console.log("Could not save");
        }
    }
}
