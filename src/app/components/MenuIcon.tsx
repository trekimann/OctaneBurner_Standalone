import * as React from "react";

const liStyle = {
    float: "right",
};
const buttonStyle = {
    height: "20px",
    paddingRight: "2px",
    paddingTop: "2px",
    "-webkit-app-region": "no-drag",
};

export class MenuIcon extends React.Component<{
    liStyle?: any,
    buttonStyle?: any,
    imgSrc?: any,
    onClick?: any,
    altText?: string,
}, {}> {
    public render() {
        // tslint:disable-next-line: max-line-length
        return <li style={this.props.liStyle ? this.props.liStyle : liStyle}><input style={this.props.buttonStyle ? this.props.buttonStyle : buttonStyle} type="image" src={this.props.imgSrc} alt={this.props.altText} onClick={this.props.onClick} title={this.props.altText} /></li>;
    }
}
