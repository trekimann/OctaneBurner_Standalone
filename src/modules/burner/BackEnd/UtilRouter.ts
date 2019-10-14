import { app } from "electron";
import { Logger } from "../../../CORE/Util/Logger";
import { Details } from "./Details";
import { Tasks } from "./Tasks";
import { UserDetails } from "./UserDetails";

export class UtilRouter {
    private path = app.getAppPath();
    private Logger = new Logger(this.path + "\\log.log");
    private Details = new Details(this.path, this.Logger);
    private Tasks = new Tasks(this.Logger, this.Details);
    private User = new UserDetails(this.Logger, this.Details);

    constructor(log: Logger, path: string) {
        this.Logger = log;
        this.path = path;
        this.Logger.Log("UtilRouter Created");
    }

    public route = (target: string, data: any) => {
        this.Logger.Log("In UtilRouter: " + target);
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
