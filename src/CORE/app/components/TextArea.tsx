// import { convertToRaw, EditorState, RichUtils } from "draft-js";
// import createMentionPlugin, { defaultSuggestionsFilter } from "draft-js-mention-plugin";
// const createMentionPlugin = require("draft-js-mention-plugin");
// const defaultSuggestionsFilter = require ("draft-js-mention-plugin")
// import Editor from "draft-js-plugins-editor";
import * as React from "react";
// import "../../css/Draft.css";
// import "../../css/mentionsStyles.css";

const defaultStyle = {
    borderStyle: "none",
    fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
    height: "100px",
    padding: "0px",
    width: "100%",
};
export class TextArea extends React.Component<
    {
        OnChange?: any,
        Value?: string,
        Style?: any,
    },
    {
        // editorState: any,
        // contentState: any,
        // mentions: any,
    }> {
    // constructor(props: any) {
    //     super(props);
    //     this.state = {
    //         contentState: null,
    //         editorState: EditorState.createEmpty(),
    //         mentions: null,
    //     };
    // }

    // public onChange = (editorState: any) => {
    //     this.setState({ editorState });
    //     this.setState({contentState: convertToRaw(editorState.getCurrentContent())});
    //     if (this.props.OnChange !== undefined) {
    //         // this.props.OnChange(editorState.getPlainText());
    //     }
    // }

    // public handleKeyCommand = (command: any, editorState: any) => {
    //     let newState;
    //     newState = RichUtils.handleKeyCommand(editorState, command);
    //     if (newState) {
    //         this.onChange(newState);
    //         return "handled";
    //     }
    //     return "non-handled";
    // }

    public render() {
        let displayStyle = defaultStyle;
        if (this.props.Style !== null && this.props.Style !== undefined) {
            displayStyle = this.desiredStyle();
        }
        return <textarea style={displayStyle} value={this.props.Value} onChange={this.props.OnChange}></textarea>;
        // return <Editor
        //     editorState={this.state.editorState}
        //     onChange={this.onChange}
        //     handleKeyCommand={this.handleKeyCommand}
        //     />;
    }

    private desiredStyle() {
        const outputStyle = Object.assign({}, defaultStyle);
        // tslint:disable-next-line: forin
        for (const inStyle in this.props.Style) {
            outputStyle[inStyle] = this.props.Style[inStyle];
        }
        return outputStyle;
    }

    private getMentionsObject = () => {
        // retrieve the mentions user object from the back end.

    }
}

