import { ipcRenderer } from "electron";
import * as React from "React";
import { Button } from "../../../../CORE/app/Components/Button";
import { ApiUtil } from "../../Util/ApiUtil";
import { AttachmentPreview } from "./AttachmentPreview";
import { User } from "./User";

const toggleStyle = {
    backgroundColor: "rgba(19, 144, 179, 0.2)",
    borderRadius: "20px 20px 0px 0px",
};

const urlStart =
    "https://almoctane-eur.saas.microfocus.com/api/shared_spaces/146003/workspaces/1002/attachments/";
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
        let linkUrl = "";
        if (this.state.Detail !== null) {
            linkUrl = urlStart + this.state.Detail.id + "/" + this.state.Detail.name;
        }
        return <React.Fragment>
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
                        <AttachmentPreview AttachementUri={linkUrl} />
                        {this.openAttachment(linkUrl)}
                    </div>
                </div>}
        </React.Fragment>;
    }

    private openAttachment = (url: string) => {
        return <a style={{ color: "inherit", display: "flex", justifyContent: "center" }} href={url}>Download</a>;
    }

    private onRetrieve = (event: any, retrieved: any) => {
        this.setState({ Detail: retrieved });
    }
}
