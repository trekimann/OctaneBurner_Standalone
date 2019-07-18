import { ipcRenderer } from "electron";
import * as React from "react";

interface IState {
  message: string;
}

export class Dashboard extends React.Component<{}, IState> {
  public state: IState = {
    message: ""
  };

  public componentDidMount(): void {
    ipcRenderer.on("greeting", this.onMessage);
  }

  public componentWillUnmount(): void {
    ipcRenderer.removeAllListeners("greeting");
  }

  public render(): React.ReactNode {
    return <header>{this.state.message}</header>;
  }

  private onMessage = (event: any, message: string) => {
    this.setState({ message: message });
  }
}
