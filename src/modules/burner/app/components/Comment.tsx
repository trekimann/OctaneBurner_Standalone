import { ipcRenderer } from "electron";
import * as React from "React";
import { Button } from "../../../../CORE/app/Components/Button";
import { User } from "./User";

export class Comment extends React.Component<
    {
        DeleteComment: any,
        Details: any,
        userId: string,
        ReplyToComment: any,
        StoryId: string,
    },
    {
        hasError: boolean,
        loggedInUserDetails: any,
    }> {
    public static getDerivedStateFromError(error: any) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    private bsStyle = {
        backgroundColor: "rgba(125, 125, 125, 0.2)",
    };

    constructor(props: any) {
        super(props);
        this.state = {
            hasError: false,
            loggedInUserDetails: {},
        };
    }

    public componentDidMount() {
        const listen = "userRetrieve" + this.props.userId + this.props.Details.id;
        ipcRenderer.on(listen, this.onRetrieve);
        ipcRenderer.send("tsUtil",
            { source: listen, target: "user", data: { target: "retrieveUserDetails", data: this.props.userId } });
    }

    public componentWillUnmount() {
        ipcRenderer.removeAllListeners("userRetrieve" + this.props.userId + this.props.Details.id);
    }

    public componentDidCatch(error: any, info: any) {
        this.setState({ hasError: true });
    }

    public render() {
        if (this.state.hasError) {
            return <div>There was a problem Loading the Comment</div>;
        }
        const commentDetails = this.props.Details;
        let text = commentDetails.text.replace("<html>", "");
        text = text.replace("</html>", "");
        text = text.replace("<body>", "");
        text = text.replace("</body>", "");
        text = text.replace(/style=/g, "");
        const ms = new Date(Date.parse(commentDetails.creation_time));

        const creation = ms.toLocaleDateString("en-GB") + " " + ms.toLocaleTimeString();

        return <div style={this.bsStyle}>
            <User
                DoubleClick={this.props.ReplyToComment}
                UserId={commentDetails.author.id}
                UniqueId={commentDetails.id} />
            <div>Created: {creation}</div>
            <div dangerouslySetInnerHTML={{ __html: text }}></div>
            {commentDetails.author.id === this.props.userId ? this.deleteOption() : null}
        </div>;
    }

    private deleteOption() {
        return <div>
            <Button key={this.props.Details.id + "comment"}
                Style={{ backgroundColor: "Red", color: "black" }}
                Text="Delete Comment" onClick={() => this.props.DeleteComment(this.props.Details.id)} />
        </div>;
    }

    private balloon = (t: string, c: string) => {
        ipcRenderer.send("balloon",
            {
                contents: c,
                title: t,
            });
    }

    private onRetrieve = (event: any, value: any) => {
        this.setState({ loggedInUserDetails: value });
        // check if the comment mentions the logged in user
        if (this.props.Details.text.includes("mailto:" + value.email)) {
            this.balloon("Comment", "You were mentioned in a comment on " + this.props.StoryId);
        }
    }
}
