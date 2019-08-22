import * as React from "react";
import { Button } from "./Button";

const toggleStyle = {
    backgroundColor: "yellow",
};

export class Attachment extends React.Component<{ Detail: any }, { showAttachment: boolean }> {

    constructor(props: any) {
        super(props);
        this.state = {
            showAttachment: false,
        };
    }

    public toggleVisibilty = () => {
        this.setState({ showAttachment: !this.state.showAttachment });
    }

    public render() {
        return <div>
            <Button Text="Attachment detail here"
                onClick={this.toggleVisibilty}
                Style={toggleStyle} />
            <div style={this.state.showAttachment ? null : { display: "none" }}>
                <Button Text="Download" onClick={this.openAttachment} />
            </div>
        </div>;
    }

    private openAttachment = () => {
        const urlStart =
            "https://almoctane-eur.saas.microfocus.com/api/shared_spaces/146003/workspaces/1002/attachments/";
        const linkUrl = urlStart + this.props.Detail.id + "/" + this.props.Detail.name;

        window.open(linkUrl, "_blank");
    }
}
