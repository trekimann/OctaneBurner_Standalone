import { remote, ipcRenderer } from "electron";
import * as React from "react";
import { Button } from "./Button";
import { OctaneLogin } from "./OctaneLoading";
import { Spinner } from "./spinner";
import { Tasks } from "./Tasks";

export class TopOptions extends React.Component {

    constructor(props: any) {
        super(props);
        this.state = {
            loggedIn: false,
            loggingIn: false,
        };
    }

    public LoggingIn = (pending: boolean, LIN: boolean) => {
        this.setState({ loggingIn: pending });
        this.setState({ loggedIn: LIN });
    }

    public render() {
        const loginStyle = {
            backgroundColor: "#2767b0",
            color: "#eee",
            cursor: "pointer",
            fontSize: "15px",
            left: "0px",
            padding: "18px",
            position: "absolute",
            top: "45%",
            width: "100%",
        };

        return <div>
            {this.state.loggedIn ? <Tasks/> : <div>
                {this.state.loggingIn ? <Spinner /> : <OctaneLogin LoggingIn={this.LoggingIn} />}
            </div>}
        </div>;
    }
}
