import { ipcRenderer, shell } from "electron";
import * as React from "react";
import { ApiUtil } from "../ApiUtil";
import { Attachments } from "./Attachments";
import { Button } from "./Button";
import { Comments } from "./Comments";
import { Task } from "./Task";
import { User } from "./User";

const bsStyle = {
    fontSize: "18px",
    marginBottom: "5px",
    marginTop: "5px",
    padding: "18px",
};
const sStyle = {
    backgroundColor: "rgba(125, 125, 255, 0.1)",
};
const sdStyle = {
    maxHeight: "40vh",
    overflow: "auto",
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
            // should actually check if there are changes so that the specific things can be called out
            const name = story.name;
            const id = story.id;
            let description = story.description.replace("<html>", "");
            description = description.replace("</html>", "");
            description = description.replace("<body>", "");
            description = description.replace("</body>", "");
            description = description.replace(/<p>&nbsp;/g, "");
            description = description.replace(/style=/g, "");

            if (this.state.LastUpdated !== null && this.state.LastUpdated < updated) {
                const current = this.state.StoryDetails;
                if (current !== description) {
                    ipcRenderer.send("balloon",
                        {
                            contents: "Story " + id + " Has been updated",
                            title: "Story",
                        });
                }
            }
            this.setState({
                FullStory: story,
                LastUpdated: updated,
                StoryDetails: description,
                StoryName: name,
                StoryRetrieved: true,
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
            <Button
                key={"story" + this.props.StoryId}
                onDblclick={this.getStoryDetails}
                Style={bsStyle}
                onClick={this.expandStory}
                Text={linkedStory}
                HoverText="Double click to refresh story details"
                DropDown={true} />
            <div style={this.state.ExpandStory ? sStyle : { display: "none" }}>
                {this.state.StoryRetrieved ?
                    <div>
                        <Button
                            key={"storyDetail" + this.props.StoryId}
                            Style={{ backgroundColor: "#0046b0" }}
                            onClick={this.showStory}
                            Text={StoryText}
                            DropDown={true}
                            HoverText="Double Click to open in Browser"
                            onDblclick={this.openStory}
                        />
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
                            <div style={sdStyle} dangerouslySetInnerHTML={{ __html: this.state.StoryDetails }} >
                            </div>
                        </div>
                        <Attachments StoryId={this.state.FullStory.id} />
                    </div> : "Story Goes Here"}
                <Comments WorkId={this.props.StoryId} UserId={this.props.userId} />
                {(this.props.LinkedTasks || []).map((value) => {
                    return <Task key={value.id} Details={value} TaskUpdate={this.props.TaskInFlight} />;
                })}
            </div>
        </div >;
    }

    private openStory = () => {
        const url = "https://almoctane-eur.saas.microfocus.com/ui/entity-navigation?p=146003/1002&entityType=work_item&id=" + this.props.StoryId;
        shell.openExternal(url);
    }

    private Cap(input: string) {
        return input.charAt(0).toUpperCase() + input.slice(1);
    }
}
