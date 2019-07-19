import * as React from "react";
import { Button } from "./Button";
import { FindUser } from "./FindUser";
import { isAbsolute } from "path";

export class TopOptions extends React.Component {


    // public options = [
    //     { click: this.openWindow, Style: {}, Text: "Log in to Octane", mouseUp: this.loggedInClicked },
    //     // {click:"",Style:{},Text:""}
    // ];
    constructor(props) {
        super(props);
        this.logInClicked = this.logInClicked.bind(this);
        this.state = {
            loggedIn: false,
        };
    }
    public logInClicked() {
        this.setState({
            loggedIn: true,
        });
        alert("loggedIn:" + this.state.loggedIn);
    }

    public openWindow() {
        window.open("https://login.software.microfocus.com/msg/actions/showLogin", "_blank");
    }

    public render() {
        const loginStyle = {
            "position": "absolute",
            "left": "35%",
            "top": "50%",
        };

        return <div style={loginStyle}>
            <Button onClick={this.openWindow} Text="Log in to Octane" MouseUp={this.logInClicked} />
        </div>;
    }
}
