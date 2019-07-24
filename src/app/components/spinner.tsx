import * as React from "react";
import styled, {keyframes} from "styled-components";
import octIcon from "./../assets/octaneIcon.png";

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
  position: absolute;
  top: 30%;
  left: 25%;
  `;

export class Spinner extends React.Component{
    public render() {
        return <Rotate> <img width="100%" src={octIcon} alt = "Loading"/></Rotate>;
    }
}
