import * as React from "react";
import { Button } from "./Button";
import { FindUser } from "./FindUser";

export class TopOptions extends React.Component {

    public loggedInClicked = (changeTo) => {
        // this.setState({loggedIn: changeTo});
        alert(changeTo);
    }
    
    public options = [
        { click: this.openWindow, Style: {}, Text: "Log in to Octane", mouseUp: this.loggedInClicked },
        // {click:"",Style:{},Text:""}
    ];
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
        };
    }

    public openWindow() {
        window.open("https://login.software.microfocus.com/msg/actions/showLogin", "_blank");
    }


    public render() {
        return <div>
            {this.options.map((value, index) => {
                // tslint:disable-next-line: max-line-length
                return <Button Style={value.Style} onClick={value.click} Text={value.Text} onMouseUp={value.mouseUp("test")} />;
            })}
        </div>;
    }
}
