import { ipcRenderer } from "electron";
import * as React from "React";

const defaultStyle = {
    borderStyle: "none",
    height: "99.5%",
    resize: "vertical",
    width: "100%",
};

export class IFrame extends React.Component<
    { Src: string, Style?: any },
    { Style: any }> {

    constructor(props: any) {
        super(props);
        this.state = {
            Style: defaultStyle,
        };
    }

    public componentDidMount() {
        if (this.props.Style !== null && this.props.Style !== undefined) {
            this.desiredStyle(this.props.Style);
        }
    }
    public render() {
        return <React.Fragment>
            <iframe src={this.props.Src} style={this.state.Style}>
            </iframe>
        </React.Fragment>;
    }

    private desiredStyle(inputStyle: any) {
        // if there is a style submitted, compare it here to the default and only change any values which are different
        const outputStyle = Object.assign({}, this.state.Style);
        // tslint:disable-next-line: forin
        for (const inStyle in inputStyle) {
            outputStyle[inStyle] = inputStyle[inStyle];
        }
        this.setState({ Style: outputStyle });
    }

    private balloon = (t: string, c: string) => {
        ipcRenderer.send("balloon",
            {
                contents: c,
                title: t,
            });
    }
}
