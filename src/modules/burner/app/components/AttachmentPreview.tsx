import * as fs from "fs";
import * as React from "React";

const image = ["JPG", "PNG", "GIF"];
const video = ["MP4", "WEBM"];
const text = ["PDF"];

export class AttachmentPreview extends React.Component<
    { AttachementUri: string },
    {
        ShowPreview: boolean,
        Type: string,
        PreviewAvailible: boolean,
    }> {

    constructor(props: any) {
        super(props);
        this.state = {
            PreviewAvailible: false,
            ShowPreview: false,
            Type: "",
        };
    }

    public componentDidMount() {
        // check if the extension is one that can be previewed
        // get the file type
        if (this.props.AttachementUri !== undefined) {
            const s = this.props.AttachementUri.split(".");
            const type = s[s.length - 1].toUpperCase();

            image.includes(type) ? this.setState({ PreviewAvailible: true, Type: "Image" }) :
                video.includes(type) ? this.setState({ PreviewAvailible: true, Type: "Video" }) :
                    // tslint:disable-next-line: no-unused-expression
                    text.includes(type) ? this.setState({ PreviewAvailible: true, Type: "Text" }) : null;
        }
    }

    public render() {
        return <React.Fragment>{!this.state.PreviewAvailible ? null :
            <div style={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
                {this.preview()}
            </div>}
        </React.Fragment>;
    }

    private preview = () => {
        switch (this.state.Type) {
            case "Image": {
                return this.image();
            }
            case "Video": {
                return this.video();
            }
            case "Text": {
                return this.text();
            }
            default: {
                return "No match found";
            }
        }
    }

    private text = () => {
        // turn into a file request
        // return <iframe src={this.props.AttachementUri}></iframe>
        return null;
        // const raw = fs.readFileSync(this.props.AttachementUri, "utf-8");
        // return <TextArea Style={{ maxHeight: "100px" }} Value={raw} />;
    }

    private image = () => {
        return <div><img style={{ maxWidth: "100%" }} src={this.props.AttachementUri} /></div>;
    }

    private video = () => {
        return <video controls style={{ maxWidth: "100%" }} src={this.props.AttachementUri} />;
    }

}
