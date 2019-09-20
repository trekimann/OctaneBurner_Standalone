import { app } from "electron";
import { Details } from "./Details";
import { Logger } from "./Logger";
import { Tasks } from "./Tasks";
import { UserDetails } from "./UserDetails";

export class UtilRouter {
    private path = app.getAppPath();
    private Logger = new Logger(this.path + "\\log.log");
    private Details = new Details(this.path, this.Logger);
    private Tasks = new Tasks(this.Logger, this.Details);
    private User = new UserDetails(this.Logger, this.Details);

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
