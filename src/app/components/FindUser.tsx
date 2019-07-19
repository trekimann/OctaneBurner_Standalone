import * as React from "react";
import {Button} from "./Button";
import {TextInput} from "./TextInput";

export class FindUser extends React.Component{

    public render() {
        return <div>
            <TextInput/><Button/>
        </div>;
    }
}
