import * as React from "react";
import { ipcRenderer } from "electron";
import { MenuIcon } from './MenuIcon';

const menuStyle = {
  'ms-overflow-style': 'scrollbar',
  '-webkit-app-region': 'drag',
  'min-width': '100%',
  'position': 'fixed',
  'top': 0,
  'left': 0,
  'background-color': 'rgb(65, 64, 64)',
  'color': 'white'
};

interface IState {
  message: string;
}

export class MenuBar extends React.Component {

  public render(): React.ReactNode {
    const minIcon = 'src/app/assets/minimise.png';

    return (<header style={menuStyle}> Octane Burner
      <nav>
        <MenuIcon imgSrc={this.minIcon} />
      </nav>
    </header>);
  }

  // private onMessage = (event: any, message: string) => {
  //   this.setState({ message: message });
  // };
}
