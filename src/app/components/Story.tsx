import { ipcRenderer } from "electron";
import * as React from "react";
import { ApiUtil } from "../ApiUtil";
import { Attachments } from "./Attachments";
import { Button } from "./Button";
import { Comments } from "./Comments";
import { Task } from "./Task";
import { User } from "./User";

const bsStyle = {
    fontSize: "18px",
    padding: "18px",
};

export class Story extends React.Component<
    { StoryId: string, userId: string, StoryType?: string, LinkedTasks?: [], TaskInFlight?: any },
    {
        ExpandStory: boolean,
        Frequency: number,
        FrequencyMultiplier: number,
        FullStory: any,
        ShowStory: boolean,
        StoryRetrieved: boolean,
        StoryDetails: any,
        StoryName: string,
        LastUpdated: Date,
    }> {

    private sStyle = {
        backgroundColor: "rgba(125, 125, 255, 0.1)",
    };
    private sdStyle = {
        maxHeight: "40vh",
        overflow: "auto",
    };
    private timer: NodeJS.Timeout;

    constructor(props: any) {
        super(props);
        this.state = {
            ExpandStory: false,
            Frequency: 60000,
            FrequencyMultiplier: 5,
            FullStory: null,
            LastUpdated: null,
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
        this.timer = setInterval(
            () => this.getStoryDetails(this.props.StoryId), (this.state.Frequency) * this.state.FrequencyMultiplier);
    }

    public showStory = () => {
        const ChangeTo = !this.state.ShowStory;
        this.setState({ ShowStory: ChangeTo });
    }
    public expandStory = () => {
        const ChangeTo = !this.state.ExpandStory;
        this.setState({ ExpandStory: ChangeTo });
    }

    public updateStory = (event: any, value: any) => {
        // story details come in here, use this to put them into state to refresh the story element
        const story = value;
        const updated = new Date(story.last_modified);
        if (this.state.LastUpdated === null || this.state.LastUpdated < updated) {
            const name = story.name;
            const id = story.id;
            let description = story.description.replace("<html>", "");
            description = description.replace("</html>", "");
            description = description.replace("<body>", "");
            description = description.replace("</body>", "");
            description = description.replace(/style=/g, "");

            this.setState({
                FullStory: story,
                LastUpdated: updated,
                StoryDetails: description,
                StoryName: name,
                StoryRetrieved: true,
            });

            ipcRenderer.send("balloon",
                {
                    contents: "Story " + id + " Has been updated",
                    title: "Story",
                });
        }
    }

    public getStoryDetails = (storyId: string) => {
        ApiUtil.getStoryDetails(null, this.props.StoryId, "StoryDetails" + this.props.StoryId);
    }

    public render() {
        let linkedStory = "Associated " + this.props.StoryType + ": " + this.props.StoryId;
        let StoryText = "Description";
        if (this.state.StoryRetrieved === true) {
            linkedStory = this.props.StoryId + ": " + this.state.StoryName;
            StoryText = this.Cap(this.state.FullStory.subtype) + " Description";
        }
        return <div>
            <Button onDblclick={this.getStoryDetails}
                Style={bsStyle}
                onClick={this.expandStory}
                Text={linkedStory}
                HoverText="Double click to refresh story details"
                DropDown={true}/>
            <div style={this.state.ExpandStory ? this.sStyle : { display: "none" }}>
                {this.state.StoryRetrieved ?
                    <div>
                        <Button Style={{ backgroundColor: "#0046b0" }}
                            onClick={this.showStory} Text={StoryText} DropDown={true} />
                        <div style={this.state.ShowStory ? null : { display: "none" }}>
                            <User
                                UserId={this.state.FullStory.author.id}
                                UniqueId={this.props.StoryId + "author"}
                                AdditionalDescription="Author"
                            />
                            {this.state.FullStory.owner !== null && this.state.FullStory.owner !== undefined ?
                                <User
                                    UserId={this.state.FullStory.owner.id}
                                    UniqueId={this.props.StoryId + "owner"}
                                    AdditionalDescription="Owner" /> : null}
                            <div style={this.sdStyle} dangerouslySetInnerHTML={{ __html: this.state.StoryDetails }} >
                            </div>
                        </div>
                        <Attachments StoryId={this.state.FullStory.id} />
                    </div> : "Story Goes Here"}
                <Comments WorkId={this.props.StoryId} UserId={this.props.userId} />
                {(this.props.LinkedTasks || []).map((value) => {
                    return <Task key={value.id} Details={value} TaskUpdate={this.props.TaskInFlight} />;
                })}
                <br></br>
            </div>
        </div >;
    }

    private Cap(input: string) {
        return input.charAt(0).toUpperCase() + input.slice(1);
    }
}
