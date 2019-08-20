import * as React from "react";

const liStyle = {
    float: "right",
};
const defaultStyle = {
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
    altSrc?: any,
}, {}> {
    public render() {
        let styling = defaultStyle;
        if (this.props.buttonStyle !== null && this.props.buttonStyle !== undefined) {
            styling = this.desiredStyle();
        }
        return <li style={this.props.liStyle ? this.props.liStyle : liStyle}>
            <input style={styling}
                type="image" src={this.props.imgSrc}
                alt={this.props.altText}
                onClick={this.props.onClick}
                title={this.props.altText} />
        </li>;
    }

    private desiredStyle() {
        // if there is a style submitted, compare it here to the default and only change any values which are different
        const outputStyle = Object.assign({}, defaultStyle);
        // tslint:disable-next-line: forin
        for (const inStyle in this.props.buttonStyle) {
            outputStyle[inStyle] = this.props.buttonStyle[inStyle];
        }
        return outputStyle;
    }
}
