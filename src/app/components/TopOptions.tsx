import { remote, ipcRenderer } from "electron";
import * as React from "react";
import { Button } from "./Button";
import { FindUser } from "./FindUser";

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
        const loginWindow = remote.BrowserWindow.getFocusedWindow();
        loginWindow.hide();
        const password = "";
        const userName = "";
        let usernameJs = "document.getElementById('federateLoginName')";
        usernameJs += ".value='" + userName + "';";
        usernameJs += "document.getElementById('fed-submit').click();";
        let passJs = "document.getElementById('password')";
        passJs += ".value = '" + password + "';";
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
            ipcRenderer.send("balloon", { "title": "Success", "contents": "Logged in" });
            // TODO: Make this actually check the success of the login
        });

        this.setState({
            loggedIn: true,
        });
    }

    public render() {
        const loginStyle = {
            "background-color": "#2767b0",
            "color": "#eee",
            "cursor": "pointer",
            "font-size": "15px",
            "left": "0px",
            "padding": "18px",
            "position": "absolute",
            "top": "45%",
            "width": "100%",
        };

        return <div>
            {this.state.loggedIn ? <FindUser /> :
                <Button Style={loginStyle} onClick={this.openWindow} Text="Log in to Octane" />}
        </div>;
    }

    private wait(ms) {
        const start = Date.now();
        let diff = 0;
        while (diff < ms) {
            diff = Date.now() - start;
        }
    }
}
