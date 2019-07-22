import * as React from "react";
import { Button } from "./Button";
import { FindUser } from "./FindUser";
import { isAbsolute } from "path";

export class TopOptions extends React.Component {

    constructor(props) {
        super(props);
        this.openWindow = this.openWindow.bind(this);
        this.state = {
            loggedIn: false,
        };
    }

    public openWindow() {
        window.open("https://login.software.microfocus.com/msg/actions/showLogin", "_blank");
        this.setState({
            loggedIn: true,
        });
    }

    public render() {
        const loginStyle = {
            "position": "absolute",
            "width": "100%",
            "top": "45%",
            "left": "0px",
            "cursor": "pointer",
            "padding": "18px",
            // "border": "none",
            // "outline": "none",
            "font-size": "15px",
        };

        return <div>
            {this.state.loggedIn ? <FindUser/> :
                <Button Style={loginStyle} onClick={this.openWindow} Text="Log in to Octane" />}
        </div>;
    }
}
