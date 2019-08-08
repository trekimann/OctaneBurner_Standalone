import { ipcRenderer } from "electron";
import * as React from "react";
import { Button } from "./Button";

const styling = {
    background: "rgba(10, 10, 10, 0.5)",
};

export class User extends React.Component<
    { UserId: string, UniqueId: string },
    { UserName: string, UserDetails: any, ShowUser: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = {
            ShowUser: false,
            UserDetails: null,
            UserName: "",
        };
    }
    public componentDidMount() {
        const listen = "userRetrieve" + this.props.UserId + this.props.UniqueId;
        ipcRenderer.on(listen, this.onRetrieve);
        ipcRenderer.send("cSharp",
            { source: listen, target: "user", data: { target: "retrieveUserDetails", data: this.props.UserId } });
    }

    public componentWillUnmount() {
        ipcRenderer.removeAllListeners("userRetrieve" + this.props.UserId + this.props.UniqueId);
    }

    public onRetrieve = (event: any, value: any) => {
        this.setState({ UserDetails: value, UserName: value.first_name + " " + value.last_name });
    }

    public toggleVisiblity = () => {
        const show = !this.state.ShowUser;
        this.setState({ ShowUser: show });
    }

    public render() {
        return <div>
            {this.state.UserDetails === null ?
                <div>User: {this.props.UserId}</div> :
                <div>
                    <Button onClick={this.toggleVisiblity} Text={this.state.UserName} />
                    <div style={this.state.ShowUser ? styling : { display: "none" }}>
                        <div>Email: {this.state.UserDetails.email}</div>
                    </div>
                </div>
            }
        </div>;
    }
}
