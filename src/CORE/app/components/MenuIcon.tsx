import { ipcRenderer } from "electron";
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
    altSrc?: any,
    altText: string,
    buttonStyle?: any,
    imgSrc: any,
    liStyle?: any,
    onClick: any,
    rightClick?: any,
}, {
    imgSrc: any,
}> {

    constructor(props: any) {
        super(props);
        this.state = {
            imgSrc: null,
        };
    }

    public componentDidMount() {
        if (this.props.imgSrc !== undefined && this.props.imgSrc !== null) {
            this.setState({ imgSrc: this.props.imgSrc });
        }
        ipcRenderer.on("toggleIcon" + this.props.altText, this.toggleSrc);
    }
    public render() {
        let styling = defaultStyle;
        if (this.props.buttonStyle !== null && this.props.buttonStyle !== undefined) {
            styling = this.desiredStyle();
        }
        return <li style={this.props.liStyle ? this.props.liStyle : liStyle}>
            <input style={styling}
                type="image"
                src={this.state.imgSrc}
                alt={this.props.altText}
                onClick={this.click}
                title={this.props.altText}
                onContextMenu={this.rightClick} />
        </li>;
    }

    public toggleSrc = () => {
        if (this.props.altSrc !== undefined && this.props.altSrc !== null) {
            if (this.state.imgSrc === this.props.imgSrc) {
                this.setState({ imgSrc: this.props.altSrc });
            } else {
                this.setState({ imgSrc: this.props.imgSrc });
            }
        }
    }

    private rightClick = () => {
        if (this.props.rightClick !== undefined) {
            this.props.rightClick();
        } else {

        }
    }

    private click = () => {
        document.activeElement.blur();
        if (this.props.onClick !== undefined && this.props.onClick !== null) {
            this.props.onClick();
        }
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
