import * as React from "react";
import { ApiUtil } from "../ApiUtil";
import { Button } from "./Button";
import { User } from "./User";

export class Comment extends React.Component<{ Details: any, userId: string }, { hasError: boolean }> {
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
        };
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
            <User UserId={commentDetails.author.id} UniqueId={commentDetails.id} />
            <div>Created: {creation}</div>
            <div dangerouslySetInnerHTML={{ __html: text }}></div>
            {commentDetails.author.id === this.props.userId ? this.deleteOption() : null}
        </div>;
    }

    private deleteComment = () => {
        const r = confirm("Are you sure you want to delete?");
        if (r === true) {
            ApiUtil.DeleteComment(null, this.props.Details.id);
        }
    }

    private deleteOption() {
        return <div>
            <Button Style={backgroundColor: "Red"; color: "black"}
            Text={this.props.Details.id} onClick={this.deleteComment} />
        </div>;
    }
}
