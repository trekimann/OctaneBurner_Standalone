import * as React from "react";

export class Button extends React.Component{
    public render() {
        return <button style = {this.props.Style} onClick = {this.props.onClick}>{this.props.Text}</button>;
    }
}
