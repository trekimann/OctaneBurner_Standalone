import { ipcRenderer } from "electron";
import * as React from "react";
import { Button } from "./Button";
import { TextInput } from "./TextInput";

export class FindUser extends React.Component {
    // public componentDidMount(): void {
    //     ipcRenderer.on("FindUser", null);
    // }

    public render() {
        function boxFocus() {
            ipcRenderer.send("cSharp", { target: "octaneApi", data: { endpoint: "workspaceId" }, source: "FindUser" });
        }

        return <div>
            <TextInput Focus={boxFocus} Placeholder="Enter Username" /><Button Text="Search" />
        </div>;
    }
}
