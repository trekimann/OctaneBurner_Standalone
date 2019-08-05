import { ipcRenderer } from "electron";
import * as React from "react";
import { ApiUtil } from "../ApiUtil";
import { Button } from "./Button";

export class Timer extends React.Component<{
    taskInProgress: string,
    updateActualHours: any,
},
    {
        buttonText: string,
        buttonAction: any,
        startTime: number,
        taskInProgress: string,
    }> {
    constructor(props: any) {
        super(props);
        this.state = {
            buttonAction: this.startTimer,
            buttonText: "Start Tracking",
            startTime: null,
            taskInProgress: this.props.taskInProgress,
        };
    }

    public startTimer = () => {
        if (this.state.taskInProgress !== "none") {
            this.setState({ startTime: Date.now() });
            this.setState({ buttonText: "Stop Tracking" });
            this.setState({ buttonAction: this.stopTimer });
        } else {
            ipcRenderer.send("balloon",
                {
                    "title": "Tasks",
                    "contents": "A task is already being tracked: " + this.state.taskInProgress });
        }
    }

    public stopTimer = () => {
        const endTime = Date.now();
        this.setState({ buttonText: "Start Tracking" });
        this.setState({ buttonAction: this.startTimer });

        let difference = (endTime - this.state.startTime) / 3600000; // in ms. need to change to hour.
        difference = Number(difference.toFixed(1)); // to within 6 min
        this.props.updateActualHours(difference);
    }

    public render() {
        return <div>
            <Button Text={this.state.buttonText} onClick={this.state.buttonAction} />
        </div>;
    }
}
