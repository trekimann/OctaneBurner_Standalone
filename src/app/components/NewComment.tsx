import * as React from "react";
import { Button } from "./Button";
import { TextArea } from "./TextArea";

export class NewComment extends React.Component<{
    commentUpdate: any,
    commentValue: string,
    submitComment: any,
    workId: string,
},
    { showTextbox: boolean }> {

    constructor(props: any) {
        super(props);
        this.state = {
            showTextbox: false,
        };
    }
    public toggle = () => {
        this.setState({ showTextbox: !this.state.showTextbox });
    }

    // public componentDidUpdate = () => {
    //     // got a new update to the comment value, if not showing, expand the comment
        
    // }

    public render() {
        return <div>
            <Button
                key={"newComment" + this.props.workId}
                Style={{ backgroundColor: "rgb(53,147,255)" }}
                Text="Add new Comment"
                onClick={this.toggle}
                DropDown={true} />
            <div style={this.state.showTextbox ? null : { display: "none" }}>
                <TextArea Value={this.props.commentValue} OnChange={this.props.commentUpdate} />
                <Button
                    key={"newCommentSubmit" + this.props.workId}
                    Text="Submit" onClick={this.props.submitComment} />
            </div>
        </div>;
    }
}
