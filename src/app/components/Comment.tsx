import * as React from "react";

export class Comment extends React.Component<{ Details: any }, {}> {
    private bsStyle = {
        backgroundColor: "rgba(125, 125, 125, 0.2)",
    };

    public render() {
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
