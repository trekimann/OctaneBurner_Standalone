import * as React from "react";

const defaultStyle = {
    backgroundColor: "#2767b0",
    border: "none",
    color: "#eee",
    cursor: "pointer",
    marginBottom: "2px",
    marginTop: "2px",
    padding: "2px",
    width: "100%",
};
export class Button extends React.Component<{
    Style?: any,
    onClick?: any,
    Text?: string,
    MouseUp?: any,
    Src?: any,
    MouseDown?: any,
    onDblclick?: any,
    HoverText?: string,
    DropDown?: boolean,
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
        return <button style={this.state.Style}
            onClick={(this.click)}
            onDoubleClick={this.props.onDblclick}
            onMouseUp={this.props.MouseUp}
            src={this.props.Src}
            onMouseDown={this.props.MouseDown}
            title={hover}>
            {this.props.Text}
        </button>;
    }

    private click = () => {
        if (this.props.Style !== null && this.props.Style !== null) {
            this.desiredStyle(this.props.Style);
        }
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
        document.activeElement.blur();
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
}
