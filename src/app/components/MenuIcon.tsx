import * as React from "react";

let liStyle = {
    "float": "right",
};
const buttonStyle = {
    "padding-right": "2px",
    "padding-top": "2px",
    "height": "15px",
    "-webkit-app-region": "no-drag",
};

export class MenuIcon extends React.Component {
    public render() {
        // tslint:disable-next-line: max-line-length
        return <li style={this.props.liStyle ? this.props.liStyle : liStyle}><input style={this.props.buttonStyle ? this.props.buttonStyle : buttonStyle} type="image" src={this.props.imgSrc} alt="Minimise" onClick={this.props.onClick} /></li>;
    }
}
