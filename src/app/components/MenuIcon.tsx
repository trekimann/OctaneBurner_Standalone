import * as React from "react";

const style = {
    "display":"block"
};

export class MenuIcon extends React.Component {
    public props = {
        imgSrc: ""
    };
    public render() {
        return <li><input type = "image" src = {this.props.imgSrc} style = {style}>icon</input></li>;
    }
};
