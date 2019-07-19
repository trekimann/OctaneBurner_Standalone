import * as React from "react";

export class TextInput extends React.Component {

    public render() {
        return <input type = {this.props.Type} style = {this.props.Style} onFocus = {this.props.Focus}></input>;
    }
}
