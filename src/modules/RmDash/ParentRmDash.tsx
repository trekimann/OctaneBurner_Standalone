import * as React from "React";

export class ParentRmDash extends React.Component<{}, {}> {

    constructor(props: any) {
        super(props);
        this.state = {
        };
    }

    public render() {
        return <iframe src="https://rmdashboard.network.uk.ad/"
            style={{ width: "100%", borderStyle: "none", height: "90vh", resize: "vertical" }}>
        </iframe>;
    }

}
