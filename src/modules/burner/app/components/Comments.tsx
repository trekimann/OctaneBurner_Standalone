import { ipcRenderer } from "electron";
import * as React from "React";
import { Button } from "../../../../CORE/app/Components/Button";
import { ApiUtil } from "../../Util/ApiUtil";
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
            FrequencyMultiplier: 2,
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
        this.getComments();
        this.timer = setInterval(() => this.getComments(), (this.state.Frequency) * this.state.FrequencyMultiplier);
        // this.balloon("Comments", "Mounted");
    }

    public componentWillUnmount() {
        clearInterval(this.timer);
        ipcRenderer.removeAllListeners("comments" + this.props.WorkId);
        ipcRenderer.removeAllListeners(this.props.WorkId + "postComment");
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
        if (value.status === 201) {
            this.setState({ NewComment: "" });
            this.getComments();
        } else {
            this.balloon("Comment", "Error Posting Comment");
        }
    }

    public removeComment = (id: string) => {
        // TODO: some form of check for when comments are retireved to see if there are any that have been removed.
        const r = confirm("Are you sure you want to delete?");
        if (r === true) {
            ApiUtil.DeleteComment(null, id);
            for (const com of this.state.RetrievedComments) {
                if (com.id === id) {
                    this.setState((state) => {
                        // cant mutate state so need to replace it
                        const RetrievedComments = state.RetrievedComments.filter((ele: any) => {
                            return ele.id !== com.id;
                        });
                        RetrievedComments.sort((a: any, b: any) => {
                            return new Date(b.creation_time).getTime() - new Date(a.creation_time).getTime();
                        });
                        return { RetrievedComments };
                    });
                    break;
                }
            }
        }
    }

    public render() {
        let endText = " comments";
        if (Number(this.state.RetrievedComments.length) === 1) {
            endText = " comment";
        }
        const text = String(this.state.RetrievedComments.length) + endText + " found on story";
        return <React.Fragment>
            <Button
                key={"comments" + this.props.WorkId}
                Style={{ backgroundColor: "#2732b0" }} onClick={this.ToggleComments}
                Text={text} onDblclick={this.getComments}
                HoverText="Double click to update Comments"
                DropDown={true} />
            <div style={this.state.ShowComments ? {
                maxHeight: "40vh",
                overflow: "auto",
            } : { display: "none" }}>
                <NewComment
                    commentUpdate={this.commentUpdate}
                    commentValue={this.state.NewComment}
                    submitComment={this.submitNewComment}
                    workId={this.props.WorkId}
                />
                {(this.state.RetrievedComments || []).map((value: any) => {
                    return <Comment
                        key={value.id}
                        Details={value}
                        DeleteComment={this.removeComment}
                        ReplyToComment={this.replyToUser}
                        StoryId={this.props.WorkId}
                        userId={this.props.UserId}
                        />;
                })}
            </div>
        </React.Fragment>;
    }

    private replyToUser = (email: string, name: string) => {
        const mailTo = "mailto:" + email;
        const reply = "<a href=\"" + mailTo + "\">" + name + "</a>";
        this.setState({ NewComment: reply });
    }

    private updateComments = (event: any, value: any) => {
        // comments come in here individually, store them im an array and create a react element for each one.

        if (!(this.state.RetrievedComments.filter((e: any) => e.id === value.id).length > 0)) {
            // should try to store them in creation order
            this.setState((state) => {
                // cant mutate state so need to replace it
                const RetrievedComments = state.RetrievedComments.concat(value);
                RetrievedComments.sort((a: any, b: any) => {
                    return new Date(b.creation_time).getTime() - new Date(a.creation_time).getTime();
                });
                return { RetrievedComments };
            });
            this.balloon("Comments", "New Comment on " + this.props.WorkId);
        }
    }

    private balloon(Title: string, Contents: string) {
        ipcRenderer.send("balloon", { title: Title, contents: Contents });
    }
}
