import { Logger } from "../../../CORE/Util/Logger";
import { Details } from "./Details";

export class UserDetails {
    private Logger: Logger;
    private Details: Details;
    constructor(log: Logger, deets: Details) {
        this.Logger = log;
        this.Details = deets;
        this.Logger.Log("UserDetails Created");
    }
    public route = (data: any) => {
        const target = data.target;
        this.Logger.Log("Routing UserDetails: " + target);
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
            if (email.toUpperCase() === target.toUpperCase()) {
                toReturn = ID;
            }
            userList.set(ID, person);
        }
        // update the data store with the ID
        const update: {
            property: string;
            value: any;
        } = { property: "", value: null };
        update.property = "USERID";
        update.value = toReturn;
        this.Details.update(update);
        update.property = "USERLIST";
        update.value = userList;
        this.Details.update(update);
        // update.property = "MENTIONS";
        // update.value = this.createMentions(userList);
        // this.Details.update(update);
        // return the userId
        return toReturn;
    }

    private createMentions = (userList: Map<string, any>) => {
        // make an array of mention objects and store it.
        // loop over every user, create a new array with objects in the form
        // name: "", link:"", avatar: ""

        const mentions = [];

        for (const id of Array.from(userList.keys())) {
            const user = userList.get(id);
            const object = {
                avatar: "https://almoctane-eur.saas.microfocus.com/api/shared_spaces/146003/workspaces/1002/workspace_users/" + user.id + "/avatar",
                link: "mailto:" + user.email,
                name: user.first_name + " " + user.last_name,
            };
            mentions.push(object);
        }
        return mentions;
    }
}
