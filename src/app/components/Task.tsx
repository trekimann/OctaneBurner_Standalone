import { ipcRenderer, remote } from "electron";
import * as React from "react";
import { ApiUtil } from "./../ApiUtil";
import { Button } from "./Button";
import { Story } from "./Story";
import { Timer } from "./Timer";

export class Task extends React.Component<{
    Details: any,
    TaskUpdate: any,
}, {
    ActualHours: number,
    RemainingHours: number,
    ShowTask: boolean,
}> {
    public tStyle = {
        backgroundColor: "rgba(0, 125, 255, 0.2)",
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
            RemainingHours: Number(this.task.remaining_hours),
            ShowTask: false,
        };
    }

    public showTask = () => {
        const ChangeTo = !this.state.ShowTask;
        this.setState({ ShowTask: ChangeTo });
    }

    public updateTask = (updated: number) => {
        // make API call here and update values in c#
        if (updated > 0) {
            const newTotal = this.state.ActualHours + updated;
            let newRemaining = this.state.RemainingHours - updated;
            if (newRemaining <= 0) {
                newRemaining = 0;
            }
            this.setState({
                ActualHours: newTotal,
                RemainingHours: newRemaining,
            });
            const changes = { invested_hours: newTotal, remaining_hours: newRemaining };
            const toSend = JSON.stringify(changes);
            const update = { taskId: this.id, data: toSend, after: this.taskUpdated };
            ApiUtil.updateTask(update);
        } else {
            this.balloon("Tasks", "Less than 6 minutes was tracked, the task was not updated");
        }
    }

    public taskUpdated = (update: any) => {
        this.balloon("Tasks", "Hours updated");
    }

    public render() {
        const taskText = this.id + ": " + this.task.name;
        return <div>
            <Button onClick={this.showTask} Text={taskText} />
            <div style={this.state.ShowTask ? this.tStyle : { display: "none" }}>
                {/* <Story StoryId={this.task.story.id} StoryType={this.task.story.type} /> */}
                <div>Task Name: {this.task.name}</div>
                <div>Estimated hours:   {this.task.estimated_hours}</div>
                <div>Invested Hours:    {this.state.ActualHours}</div>
                <div>Remaining hours:   {this.state.RemainingHours}</div>
                <div>Task Phase: {this.status}</div>
                <Timer updateActualHours={this.updateTask}
                    TaskUpdate={this.props.TaskUpdate}
                    AssociatedTask={this.id} />
                <br></br>
            </div>
        </div>;
    }

    private balloon(title: string, contents: string) {
        ipcRenderer.send("balloon",
            {
                "title": title,
                "contents": contents,
            });
    }
}
