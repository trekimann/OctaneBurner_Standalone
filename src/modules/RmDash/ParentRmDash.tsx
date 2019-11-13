import * as React from "React";
import { WebView } from "../../CORE/app/Components/WebView";

export class ParentRmDash extends React.Component<{}, {}> {

    constructor(props: any) {
        super(props);
        this.state = {
        };
    }

    public render() {
        // simply shows the RM dashboard as an example of importing existing solutions quickly
        return <React.Fragment>
            <WebView Src="https://rmdashboard.network.uk.ad/" />
        </React.Fragment>;
    }
}
