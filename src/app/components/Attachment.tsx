import { ipcRenderer } from "electron";
import * as React from "react";
import { ApiUtil } from "../ApiUtil";
import { Button } from "./Button";
import { User } from "./User";

const toggleStyle = {
    backgroundColor: "rgba(19, 144, 179, 0.2)",
    borderRadius: "20px 20px 0px 0px",
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
                    <Button key={this.state.Detail.id + "button"} Text={this.state.Detail.name}
                        onClick={this.toggleVisibilty}
                        DropDown={true} />
                    <div style={this.state.showAttachment ? toggleStyle : { display: "none" }}>
                        {this.state.Detail.description !== null ? this.state.Detail.description : ""}
                        <User
                            key={this.state.Detail.id + "user"}
                            UserId={this.state.Detail.author.id}
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
