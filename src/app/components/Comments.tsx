import { ipcRenderer } from "electron";
import * as React from "react";
import { ApiUtil } from "../ApiUtil";
import { Button } from "./Button";
import { Comment } from "./Comment";
import { NewComment } from "./NewComment";

export class Comments extends React.Component<
    {
        WorkId: string,
        UserId: string,
    },
    {
        Frequency: number,
        FrequencyMultiplier: number,
        ShowComments: boolean,
        RetrievedComments: [],
        NewComment: string,
    }> {
    public timer: NodeJS.Timeout;
    constructor(props: any) {
        super(props);
        this.state = {
            Frequency: 60000,
            FrequencyMultiplier: 5,
            NewComment: "",
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
        ipcRenderer.on(this.props.WorkId + "postComment", this.commentSuccessful);
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

    public commentUpdate = (update: any) => {
        this.setState({ NewComment: update.target.value });
    }

    public submitNewComment = () => {
        if (this.state.NewComment !== "") {
            ApiUtil.PostComment(null, this.state.NewComment, this.props.UserId, this.props.WorkId);
        } else {
            this.balloon("Error", "New comment was empty");
        }
    }

    public commentSuccessful = (event: any, value: any) => {
        if (value.status === "Created") {
            this.setState({ NewComment: "" });
            this.getComments();
        } else {
            this.balloon("Comment", "Error Posting Comment");
        }
    }

    public render() {
        const text = String(this.state.RetrievedComments.length) + " comments found on story";
        return <div>
            <Button onClick={this.ToggleComments} Text={text} onDblclick={this.getComments}
                HoverText="Double click to update Comments" />
            <div style={this.state.ShowComments ? {
                maxHeight: "40vh",
                overflow: "auto",
            } : { display: "none" }}>
                {(this.state.RetrievedComments || []).map((value) => {
                    return <Comment key={value.id} Details={value} userId={this.props.UserId} />;
                })}
                <NewComment commentUpdate={this.commentUpdate}
                    commentValue={this.state.NewComment}
                    submitComment={this.submitNewComment} />
            </div>
        </div>;
    }

    private updateComments = (event: any, value: any) => {
        // comments come in here individually, store them im an array and create a react element for each one.

        // tslint:disable-next-line: max-line-length
        // TODO: change from an array to an object so that comments can be removed easily. OR loop though each one and look for the id to remove it
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

    private wait(ms: number) {
        const start = Date.now();
        let diff = 0;
        while (diff < ms) {
            diff = Date.now() - start;
        }
    }
}
