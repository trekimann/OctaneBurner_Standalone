import * as React from "react";
import styled, { keyframes } from "styled-components";
import octIcon from "./../assets/octaneIcon.png";
import { ipcRenderer } from "electron";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Rotate = styled.div`
  animation: ${rotate} 3s linear infinite;
  width: 50%;
  max-width: 400px;
  `;

const oStyle = {
  alignItems: "center",
  display: "flex",
  height: "90vh",
  justifyContent: "center",
};

export class Spinner extends React.Component<{}, { LoadingMessage: string }> {
  constructor(props: any) {
    super(props);
    this.state = {
      LoadingMessage: "",
    };
  }

  public componentDidMount() {
    ipcRenderer.on("notification", this.changeMessage);
  }

  public componentWillUnmount() {
    ipcRenderer.removeAllListeners("notification");
  }

  public render() {
    return <React.Fragment>
      <div style={oStyle}>
        <Rotate>
          <img width="100%" src={octIcon} alt="Loading" />
        </Rotate>
        <div>{this.state.LoadingMessage}</div>
      </div>
    </React.Fragment>;
  }

  private changeMessage = (event: any, message: any) => {
    this.setState({ LoadingMessage: message });
  }
}
