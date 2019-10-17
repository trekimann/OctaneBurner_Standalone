import * as React from "React";
import { ParentBurner } from "../../../modules/burner/ParentBurner";
// import { ParentConference } from "../../../modules/conference/ParentConference";
import { ParentRmDash } from "../../../modules/rmDash/ParentRmDash";
import { ParentVideoCapture } from "../../../modules/videoRecording/ParentVideoCapture";
import { Button } from "./Button";

const buttonStyle = {
    marginLeft: "1%",
    marginRight: "1%",
    width: "32.5%",
};

const containerStyle = {
    backgroundColor: "rgb(64,64,64)",
    display: "flex",
    justifyContent: "center",
    position: "fixed",
    top: "25px",
    width: "100%",
};
// const modules = new Map();

// modules.set(
//     "burner", {
//     parent: <ParentBurner />,
//     visible: true,
// });
// modules.set(
//     "rmDash", {
//     parent: <ParentRmDash />,
//     visible: false,
// });
// modules.set(
//     "videoCapture", {
//     parent: <ParentVideoCapture />,
//     visible: false,
// });
// const mods : Array<moduleObject> = [<ParentBurner />,"Octane Burner" ), <ParentRmDash />, <ParentVideoCapture />];
// [{ button: JSX.Element; parent: JSX.Element; show: boolean; text: string; }]
const mods = [
    {
        button: null,
        parent: <ParentBurner />,
        show: true,
        text: "Octane Burner",
    },
    {
        button: null,
        parent: <ParentVideoCapture />,
        show: true,
        text: "Video Capture",
    },
    {
        button: null,
        parent: <ParentRmDash />,
        show: true,
        text: "RM Dashboard",
    },
];

export class AppParent extends React.Component<{}, {
    Buttons: [],
    ShowBurner: boolean,
    ShowVideo: boolean,
    ShowRm: boolean,
    Modules: [],
}> {

    constructor(props: any) {
        super(props);
        this.state = {
            Buttons: [],
            Modules: [],
            ShowBurner: true,
            ShowRm: false,
            ShowVideo: false,
        };
    }

    // loop through module folder, get a list of all folders in there
    // search in each for a parentXxxXxx component
    // create a map entry for each which has a button to show them.
    // loop though the map to make menu/button and div for each.
    // store modules in a map in the state?

    public componentDidMount() {
        // loop though modules map
        if (!(this.state.Buttons.length > 0)) {
            // to stop from constant rendering, store in temp array then set the state
            const tempModules = [];
            const tempButtons = [];
            for (const module of mods) {
                // create a react fragment with the buttons and their parent.
                // put it in the array to be drawn
                const mod = this.createModuleFragment(module.text, module.parent);
                const but = this.createButtonFragment(module.text, mod);
                tempModules.push(mod);
                tempButtons.push(but);
            }
            // set state here to re-render
        }
    }

    public createModuleFragment = (name: string, parent: JSX.Element) => {
        return <div id={name + "Module"}>
            {parent}
        </div>;
    }

    // make buttons span the whole top to a min size. each button shows/hides its coresponding module.
    // DOES NOT make them not exist.
    public createButtonFragment = (text: string, linkedModule: JSX.Element) => {
        const w = ((100 / mods.length) - 0.5).toString();
        const bs = {
            marginLeft: "1%",
            marginRight: "1%",
            width: w + "%",
        };
        return <Button
            Text={text}
            onClick={() => { console.log("Button Clicked"); }}
            Style={bs}
        />;
    }

    // tslint:disable-next-line: member-ordering
    public render() {
        return <React.Fragment>
            <div style={containerStyle}>
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
            <div style={{ overflow: "auto", height: "100%" }}>
                <div style={this.state.ShowBurner ? null : { display: "none" }}>
                    <ParentBurner />
                </div>
                <div style={this.state.ShowVideo ? null : { display: "none" }}>
                    <ParentVideoCapture />
                </div>
                <div style={this.state.ShowRm ? null : { display: "none" }}>
                    <ParentRmDash />
                </div>
            </div>
        </React.Fragment>;
    }

    private ShowRm = () => {
        this.hideAll();
        this.setState({ ShowRm: !this.state.ShowRm });
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
