import { ipcRenderer } from "electron";
import * as React from "react";
import { Button } from "./Button";

const styling = {
    background: "rgba(10, 10, 10, 0.5)",
};

export class User extends React.Component<
    { UserId: string, UniqueId: string, AdditionalDescription?: string, DoubleClick?: any },
    { error: boolean, UserName: string, UserDetails: any, ShowUser: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = {
            ShowUser: false,
            UserDetails: null,
            UserName: "",
            error: false,
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

    public componentDidCatch(error: any, info: any) {
        this.setState({ error: true });
    }

    public render() {
        let buttonText = this.state.UserName;
        let hRef = "";
        if (this.props.AdditionalDescription !== null && this.props.AdditionalDescription !== undefined) {
            buttonText = this.props.AdditionalDescription + ": " + this.state.UserName;
        }
        if (this.state.UserDetails !== null) {
            hRef = "mailto:" + this.state.UserDetails.email;
        }

        return <div>
            {this.state.UserDetails === null ?
                <div>User: {this.props.UserId}</div> :
                <div>
                    <Button Style={{ backgroundColor: "rgb(40,115,21)" }}
                        onClick={this.toggleVisiblity} Text={buttonText}
                        onDblclick={this.props.DoubleClick !== undefined ? () =>
                            this.props.DoubleClick(this.state.UserDetails.email, this.state.UserName) : null}
                        HoverText={this.props.DoubleClick !== undefined ?
                        "Double Click to reply to this user" : buttonText} />
                    <div style={this.state.ShowUser ? styling : { display: "none" }}>
                        <div>Email: <a style={{ color: "inherit" }} href={hRef}>{this.state.UserDetails.email}</a>
                        </div>
                    </div>
                </div>
            }
        </div>;
    }
}
