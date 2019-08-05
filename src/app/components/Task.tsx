import { ipcRenderer, remote } from "electron";
import * as React from "react";
import { ApiUtil } from "./../ApiUtil";
import { Button } from "./Button";
import { Story } from "./Story";
import { TextInput } from "./TextInput";
import { Timer } from "./Timer";
import { any } from "prop-types";

export class Task extends React.Component<{
    Details: any,
    TaskUpdate: any,
}, {
    ActualHours: number,
    ShowStory: boolean,
    ShowTask: boolean,
}> {
    public tStyle = {
        backgroundColor: "rgba(0, 125, 255, 0.1)",
    };

    public bsStyle = {
        backgroundColor: "#2767b0",
        border: "none",
        color: "#eee",
        cursor: "pointer",
        marginBottom: "2px",
        marginTop: "2px",
        padding: "2px",
        width: "100%",
    };
    public btStyle = {
        backgroundColor: "#2767b0",
        border: "none",
        color: "#eee",
        cursor: "pointer",
        fontSize: "18px",
        marginBottom: "2px",
        marginTop: "2px",
        padding: "18px",
        width: "100%",
    };
    // pull apart task details here
    private id = this.props.Details.id;
    private task = this.props.Details;
    private status = this.task.phase.id.split(".").pop();
    constructor(props: any) {
        super(props);
        this.state = {
            ActualHours: Number(this.task.invested_hours),
            ShowStory: false,
            ShowTask: false,
        };
    }

    public showStory = () => {
        const ChangeTo = !this.state.ShowStory;
        this.setState({ ShowStory: ChangeTo });
    }

    public showTask = () => {
        const ChangeTo = !this.state.ShowTask;
        this.setState({ ShowTask: ChangeTo });
    }

    public updateTask = (updated: number) => {
        // make API call here and update values in c#
        if (updated > 0) {
            const newTotal = this.state.ActualHours + updated;
            this.setState({ ActualHours: newTotal });

        } else {
            ipcRenderer.send("balloon",
                {
                    "title": "Tasks",
                    "contents": "Less than 6 minutes was tracked, the task was not updated",
                });
        }
    }

    public render() {
        const linkedStory = "Associated Item: " + this.task.story.id;
        const taskText = this.id + ": " + this.task.name;
        return <div>
            <Button onClick={this.showTask} Style={this.btStyle} Text={taskText} />
            <div style={this.state.ShowTask ? this.tStyle : { display: "none" }}>
                <Button onClick={this.showStory} Style={this.bsStyle} Text={linkedStory} />
                <div style={this.state.ShowStory ? null : { display: "none" }}>
                    <Story />
                </div>
                <div>Item Type: {this.task.story.type} </div>
                <div>Task Name: {this.task.name}</div>
                <div>Estimated hours:   {this.task.estimated_hours}</div>
                <div>Invested Hours:    {this.state.ActualHours}</div>
                <div>Remaining hours:   {this.task.remaining_hours}</div>
                <div>Task Phase: {this.status}</div>
                <Timer updateActualHours={this.updateTask}
                    TaskUpdate={this.props.TaskUpdate}
                    AssociatedTask={this.id} />
            </div>
        </div>;
    }
}
