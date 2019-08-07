import { ipcRenderer } from "electron";
import * as React from "react";
import { ApiUtil } from "../ApiUtil";
import { Button } from "./Button";
import { Comment } from "./Comment";

export class Comments extends React.Component<
    { WorkId: string },
    {
        Frequency: number,
        FrequencyMultiplier: number,
        ShowComments: boolean,
        RetrievedComments: [],
    }> {
    public timer: NodeJS.Timeout;
    constructor(props: any) {
        super(props);
        this.state = {
            Frequency: 60000,
            FrequencyMultiplier: 5,
            RetrievedComments: [],
            ShowComments: false,
        };
    }

    public ToggleComments = () => {
        const reversed = !this.state.ShowComments;
        this.setState({ ShowComments: reversed });
    }

    public componentDidMount() {
        ipcRenderer.on("comments" + this.props.WorkId, this.updateComments);
        this.timer = setInterval(() => this.getComments(), (this.state.Frequency) * this.state.FrequencyMultiplier);
        // this.balloon("Comments", "Mounted");
    }

    public componentWillUnmount() {
        clearInterval(this.timer);
    }

    public getComments = () => {
        // this.balloon("Comments", "Checking for updates " + this.props.WorkId);
        // first need to check if there are any comments
        ApiUtil.getComments(null, this.props.WorkId, "comments" + this.props.WorkId);
    }

    public render() {
        const text = String(this.state.RetrievedComments.length) + " comments found on story";
        return <div>
            <Button onClick={this.ToggleComments} Text={text} onDblclick={this.getComments}
                HoverText="Double click to update Comments" />
            <div style={this.state.ShowComments ? {maxHeight: "40vh",
        overflow: "auto" } : { display: "none"}}>
                {(this.state.RetrievedComments || []).map((value) => {
                    return <Comment key={value.id} Details={value} />;
                })}
            </div>
        </div>;
    }

    private updateComments = (event: any, value: any) => {
        // comments come in here individually, store them im an array and create a react element for each one.
        if (!(this.state.RetrievedComments.filter((e) => e.id === value.id).length > 0)) {
            // should try to store them in creation order
            this.setState((state) => {
                // cant mutate state so need to replace it
                let RetrievedComments = state.RetrievedComments.concat(value);
                RetrievedComments.sort((a, b) => {
                    return new Date(b.creation_time).getTime() - new Date(a.creation_time).getTime();
                });
                return { RetrievedComments };
            });
            this.balloon("Comments", "New Comment on " + this.props.WorkId);
        }
    }

    private balloon(title: string, contents: string) {
        ipcRenderer.send("balloon", { "title": title, "contents": contents });
    }
}
