import * as React from "react";

export class Button extends React.Component {
    public render() {
        // tslint:disable-next-line: max-line-length
        return <button style={this.props.Style} onClick={this.props.onClick} onMouseUp={this.props.MouseUp} src={this.props.Src} onMouseDown ={this.props.MouseDown}>{this.props.Text}</button>;
    }
}
