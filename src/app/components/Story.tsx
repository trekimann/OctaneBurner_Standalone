import * as React from "react";
import { Button } from "./Button";

export class Story extends React.Component<
{ StoryId: string, StoryType: string },
{ ShowStory: boolean, StoryRetrieved: boolean }> {
    private bsStyle = {
        backgroundColor: "#2767b0",
        border: "none",
        color: "#eee",
        cursor: "pointer",
        marginBottom: "2px",
        marginTop: "2px",
        padding: "2px",
        width: "100%",
    };

    private sStyle = {
        backgroundColor: "rgba(125, 125, 255, 0.1)",
    };

    constructor(props: any) {
        super(props);
        this.state = {
            ShowStory: false,
            StoryRetrieved: false,
        };
    }

    public showStory = () => {
        const ChangeTo = !this.state.ShowStory;
        this.setState({ ShowStory: ChangeTo });
    }

    public render() {
        const linkedStory = "Associated " + this.props.StoryType + ": " + this.props.StoryId;
        return <div>
            <Button onClick={this.showStory} Style={this.bsStyle} Text={linkedStory} />
            <div style={this.state.ShowStory ? this.sStyle : { display: "none" }}>
                Story Goes Here
            </div>
        </div>;
    }


}
