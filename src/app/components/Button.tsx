import * as React from "react";

export class Button extends React.Component<
    { Style?: any,
        onClick?: any,
        Text?: string,
        MouseUp?: any,
        Src?: any,
        MouseDown?: any,
        onDblclick?: any,
        HoverText?: string }> {
    public render() {
        // tslint:disable-next-line: max-line-length
        return <button style={this.props.Style} onClick={this.props.onClick} onDoubleClick= {this.props.onDblclick} onMouseUp={this.props.MouseUp} src={this.props.Src} onMouseDown={this.props.MouseDown} title={this.props.HoverText}>{this.props.Text}</button>;
    }
}
