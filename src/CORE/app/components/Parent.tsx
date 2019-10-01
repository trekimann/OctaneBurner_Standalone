import * as React from "react";
import { ParentBurner } from "../../../modules/burner/app/components/ParentBurner";
import { ParentVideoCapture } from "../../../modules/videoRecording/app/components/ParentVideoCapture";
import { Button } from "./Button";

const buttonStyle = {
    marginLeft: "1%",
    marginRight: "1%",
    width: "48%",
};

export class AppParent extends React.Component<{}, { ShowBurner: boolean, ShowVideo: boolean }> {
    // make buttons span the whole top to a min size. each button shows/hides its coresponding module.
    // DOES NOT make them not exist.

    constructor(props: any) {
        super(props);
        this.state = {
            ShowBurner: true,
            ShowVideo: false,
        };
    }

    public render() {

        return <div>
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
            </div>
            <div style={this.state.ShowBurner ? null : { display: "none" }}>
                <ParentBurner />
            </div>
            <div style={this.state.ShowVideo ? null : { display: "none" }}>
                <ParentVideoCapture />
            </div>
        </div>;
    }

    private showBurner = () => {
        if (!this.state.ShowBurner) {
            this.setState({ShowVideo: false, ShowBurner: true});
        }
    }

    private showVideo = () => {
        if (!this.state.ShowVideo) {
            this.setState({ShowVideo: true, ShowBurner: false});
        }
    }
}
