import { ipcRenderer } from "electron";
import * as React from "react";
import { ApiUtil } from "../ApiUtil";
import { Attachment } from "./Attachment";
import { Button } from "./Button";

export class Attachments extends React.Component<{ StoryId: string }, { AttachmentDetails: [], visible: boolean }> {

    constructor(props: any) {
        super(props);
        this.state = {
            AttachmentDetails: null,
            visible: false,
        };
    }

    public toggleVisibilty = () => {
        this.setState({ visible: !this.state.visible });
    }

    public componentDidMount() {
        const listener = "storyAttachements" + this.props.StoryId;
        ipcRenderer.on(listener, this.onRetrieve);
        if (this.state.AttachmentDetails === null) {// make service call to get details
            ApiUtil.getStoryAttachments(null, this.props.StoryId, listener);
        }
    }

    public render() {
        return <div>{this.state.AttachmentDetails === null ? "Attachment Details" :
            <div>
                <Button Text="Attachments" onClick={this.toggleVisibilty} DropDown={true} />
                <div style={this.state.visible ? {
                    backgroundColor: "#1390b34d",
                    borderRadius: "20px 20px 0px 0px",
                } : { display: "none" }}>
                    {(this.state.AttachmentDetails || []).map((value) => {
                        return <Attachment key={value.id} AttachementId={value.id} />;
                    })}
                </div>
            </div>}
        </div>;
    }

    private onRetrieve = (eveny: any, retrieved: any) => {
        this.setState({ AttachmentDetails: retrieved });
    }
}
