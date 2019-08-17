import * as React from "react";

export class TextInput extends React.Component
    <{
        Placeholder?: string,
        Style?: any,
        Type?: string,
        Blur?: any,
        Focus?: any,
        Change?: any,
        Text?: string,
        disabled?: boolean,
        OnEnter?: any,
    }> {


    public render() {
        return <input placeholder={this.props.Placeholder}
            type={this.props.Type}
            style={this.props.Style}
            onFocus={this.props.Focus}
            onBlur={this.props.Blur}
            onChange={(event) => this.props.Change(event.target.value)}
            value={this.props.Text}
            disabled={this.props.disabled}
            onKeyDown={this.enterKey}></input>;
    }

    private enterKey = (e: any) => {
        if (e.keyCode === 13) {
            this.props.OnEnter();
        }
    }
}
