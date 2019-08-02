import * as React from "react";
import { ipcRenderer, remote } from "electron";
import { ApiUtil } from "./../ApiUtil";

export class Task extends React.Component {
    // pull apart task details here
    private id = this.props.Details.id;
    private task = this.props.Details;
    private status = this.task.phase.id.split(".").pop();
    public render() {
        return <div id={this.id}>{this.id}
            <p>Story Type: {this.task.story.type} </p>
            <p>Task Name: {this.task.name}</p>
            <p>Estimated hours:<input value={this.task.estimated_hours} disabled></input></p>
            <p>Invested Hours:<input value={this.task.invested_hours} disabled></input></p>
            <p>Remaining hours:<input value={this.task.remaining_hours} disabled></input></p>
            <p>Task Phase: {this.status}</p>
        </div>;
    }


}
