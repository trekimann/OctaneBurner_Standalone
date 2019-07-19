import * as React from "react";

export class OctaneLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        };
    }

    public hideSpinner = () => {
        this.setState({
            loading: false,
        });
    }

    public render() {
        const octaneUrl = "https://login.software.microfocus.com/msg/actions/showLogin";
        return (
            <div>{this.state.loading ? (
                <div>Loading</div>
            ) : null}
                <iframe src={octaneUrl}
                    onLoad={this.hideSpinner}></iframe>
            </div>
        );
    }
}
