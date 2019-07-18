import * as React from "react";

const liStyle = {
    "float": "right",
    "margin-left": "8px",
};
const buttonStyle = {
    "padding-right": "12px",
    "padding-top": "2px",
    "height": "15px",
    "-webkit-app-region": "no-drag",
}

export class MenuIcon extends React.Component {
    public render() {
        // tslint:disable-next-line: max-line-length
        return <li style={liStyle}><input style={buttonStyle} type="image" src={this.props.imgSrc} alt="Minimise" onClick={this.props.onClick}/></li>;
    }
}
