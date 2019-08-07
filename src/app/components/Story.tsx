import { ipcRenderer } from "electron";
import * as React from "react";
import { ApiUtil } from "../ApiUtil";
import { Button } from "./Button";
import { Comments } from "./Comments";

export class Story extends React.Component<
    { StoryId: string, StoryType: string },
    { ShowStory: boolean, StoryRetrieved: boolean, StoryDetails: any, StoryName: string }> {
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
            StoryDetails: null,
            StoryName: "",
            StoryRetrieved: false,
        };
    }

    public componentDidMount() {
        // set up listener for story changes and get story details
        ipcRenderer.on("StoryDetails" + this.props.StoryId, this.updateStory);
        this.getStoryDetails(this.props.StoryId);
    }

    public showStory = () => {
        const ChangeTo = !this.state.ShowStory;
        this.setState({ ShowStory: ChangeTo });
    }

    public updateStory = (event: any, value: any) => {
        // story details come in here, use this to put them into state to refresh the story element
        const story = value;
        const name = story.name;
        const id = story.id;
        const comments = story.comments;
        let description = story.description.replace("<html>", "");
        description = description.replace("</html>", "");
        description = description.replace("<body>", "");
        description = description.replace("</body>", "");

        this.setState({ StoryRetrieved: true, StoryDetails: description, StoryName: name });

        ipcRenderer.send("balloon",
            {
                "title": "Story",
                "contents": "Story " + id + " Has been updated",
            });
    }

    public getStoryDetails = (storyId: string) => {
        ApiUtil.getStoryDetails(null, this.props.StoryId, "StoryDetails" + this.props.StoryId);

    }
    public render() {
        let linkedStory = "Associated " + this.props.StoryType + ": " + this.props.StoryId;
        if (this.state.StoryRetrieved === true) {
            linkedStory = this.state.StoryName;
        }
        return <div>
            <Button onDblclick={this.getStoryDetails}
                onClick={this.showStory}
                Style={this.bsStyle}
                Text={linkedStory}
                HoverText="Double click to refresh story details" />
            <div style={this.state.ShowStory ? this.sStyle : { display: "none" }}>
                {this.state.StoryRetrieved ?
                    <div dangerouslySetInnerHTML={{ __html: this.state.StoryDetails }} >
                    </div> : "Story Goes Here"}
            </div>
            <Comments WorkId = {this.props.StoryId}/>
        </div>;
    }


}
