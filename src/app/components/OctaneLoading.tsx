import * as React from "react";
import { remote, ipcRenderer } from "electron";
import { TextInput } from "./TextInput";
import { Button } from "./Button";

export class OctaneLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            password: "",
            userName: "",
        };
    }

    public hideSpinner = () => {
        this.setState({
            loading: false,
        });
    }

    public render() {
        return <div>
            <TextInput Placeholder="Email@hastingsdirect.com" />
            <TextInput Placeholder="password" Type="password" /> <Button Text="Log in"/>
        </div>;
    }
}
