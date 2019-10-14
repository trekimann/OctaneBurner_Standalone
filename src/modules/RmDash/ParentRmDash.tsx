import { ipcRenderer } from "electron";
import * as React from "react"
import { Button } from "../../CORE/app/components/Button";

export class ParentRmDash extends React.Component<{}, {}> {

    constructor(props: any) {
        super(props);
        this.state = {
        };
    }

    public render() {
        // simply shows the RM dashboard as an example of importing existing solutions quickly
        return <React.Fragment>
            <iframe src="https://rmdashboard.network.uk.ad/"
                style={{ width: "100%", borderStyle: "none", height: "90vh", resize: "vertical" }}>
            </iframe>
            <Button Text={"Notification Example"}
                onClick={() => { this.balloon("Example", "This could contain info on an environemnt going down"); }} />
        </React.Fragment>;
    }

    private balloon = (t: string, c: string) => {
        ipcRenderer.send("balloon",
            {
                contents: c,
                title: t,
            });
    }

}
