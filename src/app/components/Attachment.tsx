import * as React from "react";
import { Button } from "./Button";
import { ipcRenderer } from "electron";
import { ApiUtil } from "../ApiUtil";
import { User } from "./User";

const toggleStyle = {
    backgroundColor: "#0069ff",
};

export class Attachment extends React.Component<{ AttachementId: string }, { Detail: any, showAttachment: boolean }> {

    constructor(props: any) {
        super(props);
        this.state = {
            Detail: null,
            showAttachment: false,
        };
    }

    public toggleVisibilty = () => {
        this.setState({ showAttachment: !this.state.showAttachment });
    }

    public componentDidMount() {
        const listener = "Attachement" + this.props.AttachementId;
        ipcRenderer.on(listener, this.onRetrieve);
        if (this.state.Detail === null) {// make service call to get details
            ApiUtil.getAttachmentDetails(null, this.props.AttachementId, listener);
        }
    }

    public render() {
        return <div>
            {this.state.Detail === null ? "Attachment here" :
                <div>
                    <Button Text={this.state.Detail.name}
                        onClick={this.toggleVisibilty}
                        Style={toggleStyle}
                        DropDown={true} />
                    <div style={this.state.showAttachment ? null : { display: "none" }}>
                        {this.state.Detail.description !== null ? this.state.Detail.description : ""}
                        <User UserId={this.state.Detail.author.id}
                            UniqueId={this.state.Detail.id + this.state.Detail.author.id}
                            AdditionalDescription="Created by" />
                        {this.openAttachment()}
                    </div>
                </div>}
        </div>;
    }

    private openAttachment = () => {
        const urlStart =
            "https://almoctane-eur.saas.microfocus.com/api/shared_spaces/146003/workspaces/1002/attachments/";
        const linkUrl = urlStart + this.state.Detail.id + "/" + this.state.Detail.name;

        return <a style={{ color: "inherit", display: "flex", justifyContent: "center" }} href={linkUrl}>Download</a>;
    }

    private onRetrieve = (event: any, retrieved: any) => {
        this.setState({ Detail: retrieved });
    }
}
