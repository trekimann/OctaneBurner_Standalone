import * as React from "React";

export class ParentRmDash extends React.Component<{}, {}> {

    constructor(props: any) {
        super(props);
        this.state = {
        };
    }

    public render() {
        // simply shows the RM dashboard as an example of importing existing solutions quickly
        return <iframe src="https://rmdashboard.network.uk.ad/"
            style={{ width: "100%", borderStyle: "none", height: "90vh", resize: "vertical" }}>
        </iframe>;
    }

}
