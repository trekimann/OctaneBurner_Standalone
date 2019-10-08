import { ipcRenderer } from "electron";
import * as React from "react";
import { Button } from "../../../../CORE/app/components/Button";
import { ApiUtil } from "../../BackEnd/ApiUtil";
import { Attachment } from "./Attachment";

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
        return <React.Fragment>{this.state.AttachmentDetails === null ? "Attachment Details" :
            <React.Fragment>
                {this.state.AttachmentDetails.length === 0 ? null :
                    <React.Fragment>
                        <Button
                            key={"attachemts" + this.state.AttachmentDetails}
                            Text={this.AttachmentsText()}
                            onClick={this.toggleVisibilty}
                            DropDown={true} />
                        <div style={this.state.visible ? {
                            backgroundColor: "#1390b34d",
                            borderRadius: "20px 20px 0px 0px",
                        } : { display: "none" }}>
                            {(this.state.AttachmentDetails || []).map((value: any) => {
                                return <Attachment key={value.id} AttachementId={value.id} />;
                            })}
                        </div>
                    </React.Fragment>}
            </React.Fragment>}
        </React.Fragment>;
    }

    private AttachmentsText = () => {
        let endText = " Attachments";
        if (Number(this.state.AttachmentDetails.length) === 1) {
            endText = " Attachment";
        }
        return String(this.state.AttachmentDetails.length) + endText;
    }

    private onRetrieve = (eveny: any, retrieved: any) => {
        this.setState({ AttachmentDetails: retrieved });
    }
}
