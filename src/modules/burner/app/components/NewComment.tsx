import * as React from "react";
import { Button } from "../../../../CORE/app/components/Button";
import { TextArea } from "../../../../CORE/app/components/TextArea";

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

    public componentDidUpdate() {
        if (this.props.commentValue !== ""
            && this.state.showTextbox === false) {
            this.setState({ showTextbox: true });
        }
    }

    public render() {
        return <React.Fragment>
            <Button
                key={"newComment" + this.props.workId}
                Style={{ backgroundColor: "rgb(53,147,255)" }}
                Text="Add new Comment"
                onClick={this.toggle}
                DropDown={true} />
            <div style={this.state.showTextbox ? null : { display: "none" }}>
                <TextArea
                    Value={this.props.commentValue}
                    OnChange={this.props.commentUpdate} />
                <Button
                    key={"newCommentSubmit" + this.props.workId}
                    Text="Submit" onClick={this.props.submitComment} />
            </div>
        </React.Fragment>;
    }
}
