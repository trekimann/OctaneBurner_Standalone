import * as React from "react";

const defaultStyle = {
    border: "none",
    fontSize: "18px",
    left: "0px",
    marginTop: "2px",
    width: "99.6%",
};

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
        let styling = defaultStyle;
        if (this.props.Style !== null && this.props.Style !== undefined) {
            styling = this.desiredStyle();
        }
        return <input placeholder={this.props.Placeholder}
            type={this.props.Type}
            style={styling}
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
