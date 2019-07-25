import { ipcRenderer, remote } from "electron";
import * as React from "react";
import { ApiUtil } from "./../ApiUtil";
import { Button } from "./Button";
import { TextInput } from "./TextInput";

export class OctaneLogin extends React.Component {

    public tbStyle = {
        border: "none",
        fontSize: "18px",
        left: "0px",
        marginTop: "2px",
        width: "99.6%",
    };
    public bStyle = {
        backgroundColor: "#2767b0",
        border: "none",
        color: "#eee",
        cursor: "pointer",
        fontSize: "18px",
        padding: "18px",
        width: "100%",
    };

    public allStyle = {
        left: "0px",
        position: "absolute",
        top: "40%",
        width: "100%",
    };

    constructor(props) {
        super(props);
        this.openWindow = this.openWindow.bind(this);
        this.state = {
            password: "",
            userName: "",
        };
    }

    public username = (name: string) => {
        this.setState({ userName: name });
    }

    public pass = (pw: string) => {
        this.setState({ password: pw });
    }

    public openWindow() {
        this.props.LoggingIn(true, false);
        const mainWindow = remote.BrowserWindow.getFocusedWindow();
        window.open("https://login.software.microfocus.com/msg/actions/showLogin", "_blank");
        const loginWindow = remote.BrowserWindow.getFocusedWindow();
        loginWindow.hide();
        mainWindow.focus();
        const password = "";
        const userName = "";
        let usernameJs = "document.getElementById('federateLoginName')";
        usernameJs += ".value='" + this.state.userName + "';";
        usernameJs += "document.getElementById('fed-submit').click();";
        let passJs = "document.getElementById('password')";
        passJs += ".value = '" + this.state.password + "';";
        let passclick = "document.getElementById('submit_button').click();";
        passclick += "";

        loginWindow.webContents.on("did-finish-load", () => {
            this.wait(1000);
            loginWindow.webContents.executeJavaScript(usernameJs);
            this.wait(1000);
            loginWindow.webContents.executeJavaScript(passJs);
            this.wait(1000);
            loginWindow.webContents.executeJavaScript(passclick);
            this.wait(3000);
            loginWindow.show();
            ipcRenderer.send("balloon", { "title": "Success", "contents": "Logged in" });
            this.props.LoggingIn(false, true);
            ApiUtil.getWorkspaceId(null);
            ApiUtil.updateUsername(this.state.userName);
            // TODO: Make this actually check the success of the login
        });
    }

    public componentDidMount(): void {
        ipcRenderer.on("usernameRetrieve", this.onRetrieve);
        ipcRenderer.send("cSharp", { source: "usernameRetrieve", target: "retrieve", data: { target: "USERNAME" } });
    }

    public componentWillUnmount(): void{
        ipcRenderer.removeAllListeners("usernameRetrieve");
    }

    public render() {
        const ph = "Email@hastingsdirect.com";
        const pw = "password";
        return <div style={this.allStyle}>
            <TextInput Style={this.tbStyle} Placeholder={ph} Change={this.username} Text={this.state.userName} />
            <TextInput Style={this.tbStyle} Placeholder={pw} Type={pw} Change={this.pass} />
            {this.state.password !== "" && this.state.userName !== "" ?
                <Button onClick={this.openWindow} Text="Log in" Style={this.bStyle} /> : null}
        </div >;
    }

    private onRetrieve = (event: any, value: string) => {
        this.setState({ userName: value });
    }
    private wait(ms) {
        const start = Date.now();
        let diff = 0;
        while (diff < ms) {
            diff = Date.now() - start;
        }
    }
}
