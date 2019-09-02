import { desktopCapturer, DesktopCapturerSource, ipcRenderer } from "electron";
import * as React from "react";
import { Button } from "./Button";

export class VideoCapture extends React.Component<{}, { DisplayId: string, ScreenId: string }> {

    constructor(props: any) {
        super(props);
        this.state = {
            DisplayId:"",
            ScreenId: "",
        };
    }

    public componentDidMount() {
        ipcRenderer.on("startRecording", this.startRecording);
        ipcRenderer.on("stopRecording", this.stopRecording);
    }

    public componentWillUnmount() {
        ipcRenderer.removeAllListeners("startRecording");
        ipcRenderer.removeAllListeners("stopRecording");
    }

    public render() {
        return <div>
            <video autoplay="autoplay"></video>{}
            <Button Text="start Video" onClick={() => this.thing(this.screenId)} />
            <Button Text="stop Video" onClick={this.stopRecording} />
        </div>;
    }

    private stopRecording = () => {
        const video: HTMLVideoElement | null = document.querySelector("video");
        if (video.srcObject !== null) {
            video.pause();
            video.srcObject = null;
        }
    }

    private startRecording = () => {

    }

    private thing(updateState: any) {
        desktopCapturer.getSources({
            thumbnailSize: {
                height: 256,
                width: 256,
            },
            types: ["screen", "window"],
        }, (error: Error, srcs: DesktopCapturerSource[]) => {
            if (error) {
                throw error;
            }
            const video: HTMLVideoElement | null = document.querySelector("video");
            for (const src of srcs) {
                if (src.name === "Screen 1") {
                    navigator.mediaDevices.getUserMedia(
                        {
                            video: {
                                // deviceId: src.id,
                                mandatory:{
                                    chromeMediaSource:"desktop",
                                    chromeMediaSourceId: src.id,
                                },
                            },
                        }).then((stream: MediaStream) => {
                            if (video) {
                                video.srcObject = stream;
                                video.play();
                            }
                        });
                    // updateState(src.id, src.display_id)
                    return;
                }
            }
        });
    }

    private screenId = (screenId: string, displayId: string ) => {
        this.setState({ ScreenId: screenId, DisplayId: displayId });
    }
}
