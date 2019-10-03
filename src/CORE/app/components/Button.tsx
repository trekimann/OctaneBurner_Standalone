import { clipboard, ipcRenderer } from "electron";
import * as React from "react";

const defaultStyle = {
    alignItems: "center",
    backgroundColor: "#2767b0",
    border: "none",
    color: "#eee",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    marginBottom: "2px",
    marginTop: "2px",
    padding: "2px",
    width: "100%",
};
const imgStyle = {
    border: "black",
    borderRadius: "50%",
    borderStyle: "double",
    height: "20px",
    marginRight: "5px",
};

export class Button extends React.Component<{
    Dissabled?: boolean,
    DropDown?: boolean,
    Hidden?: boolean,
    HoverText?: string,
    LeadImg?: string,
    MouseDown?: any,
    MouseUp?: any,
    onDblclick?: any,
    onRightClick?: any,
    onClick?: any,
    Src?: any,
    Style?: any,
    Text?: string,
}, { Style: any, Expanded: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = {
            Expanded: false,
            Style: defaultStyle,
        };
    }

    public componentDidMount() {
        if (this.props.Style !== null && this.props.Style !== undefined) {
            this.desiredStyle(this.props.Style);
        }
    }

    public render() {
        let hover = this.props.Text;
        if (this.props.HoverText !== null && this.props.HoverText !== undefined) {
            hover = this.props.HoverText;
        }
        if (this.props.Dissabled !== undefined) {
            if (this.props.Dissabled) {
                hover = "Button Dissabled";
            }
        }
        return <button style={this.state.Style}
            onClick={(this.click)}
            onDoubleClick={this.props.onDblclick}
            onMouseUp={this.props.MouseUp}
            src={this.props.Src}
            onMouseDown={this.props.MouseDown}
            title={hover}
            dissabled={this.props.Dissabled !== undefined ? this.props.Dissabled.toString() : "false"}
            onContextMenu={this.rightClick}>
            {this.props.LeadImg !== undefined ?
                <img style={imgStyle}
                    src={this.props.LeadImg}></img> : null}
            {this.props.Text}
        </button>;
    }

    private rightClick = () => {
        if (this.props.onRightClick !== undefined && this.props.onRightClick !== null) {
            this.props.onRightClick();
        } else {
            clipboard.writeText(this.props.Text);
            this.balloon("Notice", "Text Copied to clipborad");
        }
    }

    private click = () => {
        if (!this.props.Dissabled) {
            if (this.props.Style !== undefined && this.props.Style !== null) {
                this.desiredStyle(this.props.Style);
            }
            document.activeElement.blur();
            if (this.props.DropDown !== null && this.props.DropDown !== undefined) {
                if (this.props.DropDown) {
                    // change style to add curved edge for top of button if expanded, flatten if not
                    if (this.state.Expanded) {
                        this.desiredStyle({ borderRadius: null });
                    } else {
                        this.desiredStyle({ borderRadius: "15px 15px 0px 0px" });
                    }
                    this.setState({ Expanded: !this.state.Expanded });
                }
            }
            this.props.onClick();
        } else {
            this.balloon("Notice", "Button is Dissabled");
        }
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
