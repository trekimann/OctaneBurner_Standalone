import * as React from "react";
import { Button } from "./Button";

export class Timer extends React.Component<{ taskInProgress: boolean }, {
    buttonText: string,
    buttonAction: any,
    startTime: number,
    taskInProgress: boolean,
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
        this.setState({ startTime: Date.now() });
        this.setState({ buttonText: "Stop Tracking" });
        this.setState({ buttonAction: this.stopTimer });
    }

    public stopTimer = () => {
        const endTime = Date.now();
        this.setState({ buttonText: "Start Tracking" });
        this.setState({ buttonAction: this.startTimer });

        let difference = (endTime - this.state.startTime) / 3600000; // in ms. need to change to hour.
        difference = Number(difference.toFixed(1)); // to within 6 min
        if (difference > 0) {

        }
    }

    public render() {
        return <div>
            <Button Text={this.state.buttonText} onClick={this.state.buttonAction} />
        </div>;
    }
}
