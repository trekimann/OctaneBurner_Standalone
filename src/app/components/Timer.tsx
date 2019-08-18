import { ipcRenderer } from "electron";
import * as React from "react";
import { Button } from "./Button";

const startStyle = {
    backgroundColor: "#2c85aa",
    fontSize: "16px",
};

const stopStyle = {
    backgroundColor: "#de2253",
    fontSize: "16px",
};

const containterStyle = {
    display: "flex",
    justifyContent: "center",
};

export class Timer extends React.Component<{
    updateActualHours: any,
    TaskUpdate: any,
    AssociatedTask: string,
},
    {
        buttonAction: any,
        buttonText: string,
        startTime: number,
    }> {
    constructor(props: any) {
        super(props);
        this.state = {
            buttonAction: this.startTimer,
            buttonText: "Start Tracking",
            startTime: null,
        };
    }

    public startTimer = () => {
        if (this.props.TaskUpdate() === "none") {
            this.setState({ startTime: Date.now() });
            this.setState({ buttonText: "Stop Tracking" });
            this.setState({ buttonAction: this.stopTimer });
            this.props.TaskUpdate(this.props.AssociatedTask);
        } else {
            ipcRenderer.send("balloon",
                {
                    "title": "Tasks",
                    "contents": "A task is already being tracked: " + this.props.TaskUpdate(),
                });
        }
    }

    public stopTimer = () => {
        const endTime = Date.now();
        this.setState({ buttonText: "Start Tracking" });
        this.setState({ buttonAction: this.startTimer });
        this.props.TaskUpdate("none");

        let difference = (endTime - this.state.startTime) / 3600000; // in ms. need to change to hour.
        difference = Number(difference.toFixed(1)); // to within 6 min
        this.props.updateActualHours(difference);
    }

    public render() {
        return <div style ={containterStyle}>
            <Button Style={this.state.buttonText.includes("Start") ? startStyle : stopStyle}
                Text={this.state.buttonText} onClick={this.state.buttonAction} />
        </div>;
    }
}
