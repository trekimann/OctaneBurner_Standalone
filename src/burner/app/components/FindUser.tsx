import { ipcRenderer } from "electron";
import * as React from "react";
import { Button } from "../../../CORE/app/components/Button";
import { TextInput } from "../../../CORE/app/components/TextInput";

export class FindUser extends React.Component {
    // public componentDidMount(): void {
    //     ipcRenderer.on("FindUser", null);
    // }

    public render() {
        function boxFocus() {
            ipcRenderer.send("tsUtil", { target: "octaneApi", data: { endpoint: "workspaceId" }, source: "FindUser" });
        }

        return <div>
            <TextInput Focus={boxFocus} Placeholder="Enter Username" /><Button Text="Search" />
        </div>;
    }
}
