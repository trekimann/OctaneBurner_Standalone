// import { remote, ipcRenderer } from "electron";
import * as React from "React";
import { OctaneLogin } from "./app/components/OctaneLoading";
import { Spinner } from "./app/components/Spinner";
import { Tasks } from "./app/components/Tasks";

export class ParentBurner extends React.Component<{ },
    { UserId: any, loggedIn: boolean, loggingIn: boolean}> {

    constructor(props: any) {
        super(props);
        this.state = {
            UserId: null,
            loggedIn: false,
            loggingIn: false,
        };
    }

    public LoggingIn = (pending: boolean, LIN: boolean) => {
        this.setState({ loggingIn: pending });
        this.setState({ loggedIn: LIN });
    }

    public loggedIn = (id: string) => {
        this.setState({ UserId: id });
    }

    public render() {
        return <React.Fragment>
            {this.state.loggedIn ? <Tasks UserId={this.state.UserId} /> : <div>
                {this.state.loggingIn ? <Spinner /> : null}
                <div style={this.state.loggingIn ? { display: "none" } : null}>
                    <OctaneLogin LoggedIn={this.loggedIn} LoggingIn={this.LoggingIn} />
                </div>
            </div>}
        </React.Fragment>;
    }
}
