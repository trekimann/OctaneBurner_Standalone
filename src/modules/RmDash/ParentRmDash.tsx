import { ipcRenderer } from "electron";
import * as React from "React";
import { Button } from "../../CORE/app/Components/Button";
import { IFrame } from "../../CORE/app/Components/IFrame";

export class ParentRmDash extends React.Component<{}, {}> {

    constructor(props: any) {
        super(props);
        this.state = {
        };
    }

    public render() {
        // simply shows the RM dashboard as an example of importing existing solutions quickly
        return <React.Fragment>
            <IFrame Src="https://rmdashboard.network.uk.ad/" />
            {/* <Button Text={"Notification Example"}
                onClick={() => { this.balloon("Example", "This could contain info on an environemnt going down"); }} /> */}
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
