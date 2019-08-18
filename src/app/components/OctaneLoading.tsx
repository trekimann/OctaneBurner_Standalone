import { ipcRenderer, remote } from "electron";
import * as React from "react";
import { ApiUtil } from "./../ApiUtil";
import { Button } from "./Button";
import { TextInput } from "./TextInput";

const tbStyle = {
    backgroundColor: "Red",
};
const bStyle = {
    fontSize: "18px",
    padding: "18px",
};

const allStyle = {
    left: "0px",
    position: "absolute",
    top: "40%",
    width: "100%",
};

const errorStyle = {
    color: "red",
    fontSize: "18px",
};

export class OctaneLogin extends React.Component<
    { LoggingIn: any, LoggedIn: any },
    { userName: string, password: string, failedLogin: boolean }> {

    constructor(props: any) {
        super(props);
        this.openWindow = this.openWindow.bind(this);
        this.state = {
            failedLogin: false,
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
        this.setState({ failedLogin: false });
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
            loginWindow.close();
            ApiUtil.getWorkspaceId(null);
        });
    }

    public componentDidMount(): void {
        ipcRenderer.on("usernameRetrieve", this.onRetrieve);
        ipcRenderer.on("workspaceSuccess", this.logInSuccess);
        ipcRenderer.on("workspaceFail", this.loginFail);
        ipcRenderer.send("cSharp", { source: "usernameRetrieve", target: "retrieve", data: { target: "USERNAME" } });
    }

    public componentWillUnmount(): void {
        this.setState({ password: "" });
        ipcRenderer.removeAllListeners("usernameRetrieve");
        ipcRenderer.removeAllListeners("workspaceSuccess");
        ipcRenderer.removeAllListeners("workspaceFail");
    }

    public logInSuccess = (event: any, value: any) => {
        // this sets the state to logged in, put into check success action
        // value should be the workspaceID for the user.
        ipcRenderer.send("balloon", { "title": "Success", "contents": "Logged in" });
        ApiUtil.updateUsername(this.state.userName);
        this.props.LoggingIn(false, true);
    }

    public loginFail = (event: any, value: any) => {
        this.setState({ failedLogin: true });
        ipcRenderer.send("balloon", { "title": "Error", "contents": "Could not log in" });
        this.props.LoggingIn(false, false);
    }

    public render() {
        const ph = "Email@hastingsdirect.com";
        const pw = "password";
        return <div style={allStyle}>
            <TextInput Placeholder={ph} Change={this.username} Text={this.state.userName} />
            <TextInput Placeholder={pw} Type={pw} Change={this.pass} OnEnter={this.openWindow} />
            {this.state.failedLogin ?
                <div style={errorStyle}>Login Failed, Please check username and password</div> :
                null}
            {this.state.password !== "" && this.state.userName !== "" ?
                <Button onClick={this.openWindow} Text="Log in" Style={bStyle} /> : null}
        </div >;
    }

    private onRetrieve = (event: any, value: string) => {
        this.setState({ userName: value });
    }
    private wait(ms: number) {
        const start = Date.now();
        let diff = 0;
        while (diff < ms) {
            diff = Date.now() - start;
        }
    }
}
