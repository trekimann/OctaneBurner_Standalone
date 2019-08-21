import { ipcRenderer, remote, inAppPurchase } from "electron";
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
    Completed: boolean,
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
    private status = this.task.phase.name;
    constructor(props: any) {
        super(props);
        this.state = {
            ActualHours: Number(this.task.invested_hours),
            Completed: false,
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
            let Phase: { id: string; type: string; } = null;
            if (this.status === "New") {
                Phase = {
                    id: "phase.task.inprogress",
                    type: "phase",
                };
            }
            const changes = {
                invested_hours: newTotal,
                phase: (Phase !== null ? Phase : undefined),
                remaining_hours: newRemaining,
            };

            const toSend = JSON.stringify(changes);
            const update = { taskId: this.id, data: toSend, after: this.taskUpdated };
            ApiUtil.updateTask(update);
        } else {
            this.balloon("Tasks", "Less than 6 minutes was tracked, the task was not updated");
        }
    }

    public taskCompleted = () => {
        const changes = {
            phase: { id: "phase.task.completed", type: "phase" },
        };
        const toSend = JSON.stringify(changes);
        const update = { taskId: this.id, data: toSend, after: this.taskUpdated };
        ApiUtil.updateTask(update);
    }

    public taskUpdated = (update: any) => {
        this.balloon("Tasks", "Task updated");
    }

    public render() {
        const taskText = this.id + ": " + this.task.name;
        return <div>
            <Button Style={{ backgroundColor: "#2700b0" }} onClick={this.showTask} Text={taskText} />
            <div style={this.state.ShowTask ? this.tStyle : { display: "none" }}>
                <div>Task Name: {this.task.name}</div>
                <div>Estimated hours:   {this.task.estimated_hours}</div>
                <div>Invested Hours:    {this.state.ActualHours}</div>
                <div>Remaining hours:   {this.state.RemainingHours}</div>
                <div>Task Phase: {this.status} {this.status === "In Progress" ?
                    <Button Style={{backgroundColor:"#039c0d", borderRadius:"5px", maxWidth: "100%", width: null, paddingLeft: "5px", paddingRight: "5px" }}
                        Text="Move to completed" onClick={this.taskCompleted} /> : null}</div>
                {this.state.Completed ? null :
                    <Timer updateActualHours={this.updateTask}
                        TaskUpdate={this.props.TaskUpdate}
                        AssociatedTask={this.id} />
                }
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
