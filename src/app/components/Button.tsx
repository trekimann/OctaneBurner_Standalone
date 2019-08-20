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
export class Button extends React.Component<
    {
        Style?: any,
        onClick?: any,
        Text?: string,
        MouseUp?: any,
        Src?: any,
        MouseDown?: any,
        onDblclick?: any,
        HoverText?: string,
    }, {}> {


    public render() {
        let hover = this.props.Text;
        if (this.props.HoverText !== null && this.props.HoverText !== undefined) {
            hover = this.props.HoverText;
        }
        let styling = defaultStyle;
        if (this.props.Style !== null && this.props.Style !== undefined) {
            styling = this.desiredStyle();
        }

        return <button style={styling}
            onClick={this.props.onClick}
            onDoubleClick={this.props.onDblclick}
            onMouseUp={this.props.MouseUp}
            src={this.props.Src}
            onMouseDown={this.props.MouseDown}
            title={hover}>
            {this.props.Text}
        </button>;
    }

    private desiredStyle() {
        // if there is a style submitted, compare it here to the default and only change any values which are different
        const outputStyle = Object.assign({}, defaultStyle);
        // tslint:disable-next-line: forin
        for (const inStyle in this.props.Style) {
            outputStyle[inStyle] = this.props.Style[inStyle];
        }
        return outputStyle;
    }
}
