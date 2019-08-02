import * as React from "react";
import {Button} from "./Button";

export class Timer extends React.Component{

    public render(){
        return <div>
            <Button Text="Start"/><Button Text="Stop"/>
        </div>;
    }
}