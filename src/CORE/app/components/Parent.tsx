import * as React from "react";
import { ParentBurner } from "../../../modules/burner/app/components/ParentBurner";
// import { ParentConference } from "../../../modules/conference/ParentConference";
import { ParentRmDash } from "../../../modules/RmDash/ParentRmDash";
import { ParentVideoCapture } from "../../../modules/videoRecording/app/components/ParentVideoCapture";
import { Button } from "./Button";

const buttonStyle = {
    marginLeft: "1%",
    marginRight: "1%",
    width: "32.5%",
};

export class AppParent extends React.Component<{}, { ShowBurner: boolean, ShowVideo: boolean, ShowRm: boolean }> {
    // make buttons span the whole top to a min size. each button shows/hides its coresponding module.
    // DOES NOT make them not exist.

    constructor(props: any) {
        super(props);
        this.state = {
            ShowBurner: true,
            ShowRm: false,
            ShowVideo: false,
        };
    }

    public render() {

        return <React.Fragment>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                    Text="Octane Burner"
                    Style={buttonStyle}
                    onClick={this.showBurner}
                />
                <Button
                    Text="Video Recording"
                    Style={buttonStyle}
                    onClick={this.showVideo}
                />
                <Button
                    Text="RM dashboard"
                    Style={buttonStyle}
                    onClick={this.ShowRm}
                />
            </div>
            <div style={this.state.ShowBurner ? null : { display: "none" }}>
                <ParentBurner />
            </div>
            <div style={this.state.ShowVideo ? null : { display: "none" }}>
                <ParentVideoCapture />
            </div>
            <div style={this.state.ShowRm ? null : { display: "none" }}>
                <ParentRmDash />
            </div>
        </React.Fragment>;
    }

    private ShowRm = () => {
        this.hideAll();
        this.setState({ ShowRm: !this.state.ShowRm })
    }

    private showBurner = () => {
        this.hideAll();
        this.setState({ ShowBurner: true });
    }

    private showVideo = () => {
        this.hideAll();
        this.setState({ ShowVideo: true });
    }

    private hideAll = () => {
        this.setState({ ShowBurner: false, ShowVideo: false, ShowRm: false });
    }
}
