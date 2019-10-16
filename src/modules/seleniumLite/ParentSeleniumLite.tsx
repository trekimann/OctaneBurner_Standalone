import * as React from "React";

export class ParentSeleniumLite extends React.Component<{},{}> {

    // To start, this module will just act as a front end to the existing API driven seleniumLite back.
    // This is to allow a quick intergration. This will however still leave the issue with needing to open ports.
    // Eventually the C# back will be ported to this tool nativly to remove this port opening requirement.
    // Either straight up dropping the C# into the project or MAYBE re-creating it in TS/JS
    // To achieve this the API layer will be replaced with electrons ipcMain and ipcRenderer calls.
    // This should allow us to just take out the API untill class and replace it with the Ipc class
    // To that end it should use an interface to define its functions.
    // Start with just the test running ability then expand to the test creation.

    public render() {
        return <React.Fragment>
        </React.Fragment>;
    }
}
