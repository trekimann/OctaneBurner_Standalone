// import { remote, ipcRenderer } from "electron";
import * as React from "react";
import { OctaneLogin } from "../../../burner/app/components/OctaneLoading";
import { Spinner } from "./spinner";
import { Tasks } from "../../../burner/app/components/Tasks";

export class TopOptions extends React.Component<{}, { UserId: any, loggedIn: boolean, loggingIn: boolean }> {

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
            {this.state.loggedIn ? <Tasks UserId={this.state.UserId} /> : <div>
                {this.state.loggingIn ? <Spinner /> : null}
                <div style={this.state.loggingIn ? { display: "none" } : null}>
                    <OctaneLogin LoggedIn={this.loggedIn} LoggingIn={this.LoggingIn} />
                </div>
            </div>}
        </div>;
    }

    // private printPDF() {
    //     const fs = require("fs");
    //     remote.BrowserWindow.getFocusedWindow().webContents.printToPDF(
    //         { printBackground: true }, (error: any, data: any) => {
    //             if (error) { throw error }
    //             fs.writeFile("/tmp/print.pdf", data, (error2: any) => {
    //                 if (error2) { throw error2 }
    //                 console.log("Write PDF successfully.")
    //             });
    //         });
    // }

    // private printPrinter() {
    //     remote.BrowserWindow.getFocusedWindow().webContents.print({ printBackground: true });
    // }
}
