import * as React from "react";

export class Comment extends React.Component<{ Details: any }, { hasError: boolean }> {
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

        return <div style={this.bsStyle}>
            <p>Author: {commentDetails.author.id}</p>
            <p>Created: {commentDetails.creation_time}</p>
            <div dangerouslySetInnerHTML={{ __html: text }}></div>
        </div>;
    }
}
