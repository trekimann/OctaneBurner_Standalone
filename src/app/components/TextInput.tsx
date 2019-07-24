import * as React from "react";
import passIcon from "./../assets/eye512.png"

export class TextInput extends React.Component {
        public render() {
        // tslint:disable-next-line: max-line-length
        return <div style = {this.allStyle}><input placeholder={this.props.Placeholder} type={this.props.Type} style={this.props.Style} onFocus={this.props.Focus} onBlur={this.props.Blur} onChange={(event) => this.props.Change(event.target.value)}></input>
        </div>;
    }
}
