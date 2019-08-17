import * as React from "react";


const defaultStyle = {
    fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
    height: "100px",
    width: "98%",
};
export class TextArea extends React.Component<
    {
        OnChange?: any,
        Value?: string,
        Style?: any,
    },
    {}>
{

    public render() {
        let displayStyle = defaultStyle;
        if (this.props.Style !== null && this.props.Style !== undefined) {
            displayStyle = this.props.Style;
        }
        return <textarea style={displayStyle} value={this.props.Value} onChange={this.props.OnChange}></textarea>;
    }
}
