import * as React from "react";
import { Attachment } from "./Attachment";

export class Attachments extends React.Component<{ Details: [] }, {}> {

    constructor(props: any) {
        super(props);
        this.state = {
        };
    }

    public render() {
        return <div>
            {this.props.Details.map((value) => {
                return <Attachment key={value.id} Detail={value} />;
            })}
        </div>;
    }
}
