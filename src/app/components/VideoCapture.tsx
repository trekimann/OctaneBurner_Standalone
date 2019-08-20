import { desktopCapturer, DesktopCapturerSource, ipcRenderer } from "electron";
import * as React from "react";
import { Button } from "./Button";



export class VideoCapture extends React.Component<{}, {}> {

    public componentDidMount() {
        ipcRenderer.on("startRecording", this.startRecording);
        ipcRenderer.on("stopRecording", this.stopRecording);
    }

    public componentWillUnmount() {
        ipcRenderer.removeAllListeners("startRecording");
        ipcRenderer.removeAllListeners("stopRecording");
    }

    public render() {
        return <div>Video Recording Goes here
            <video autoplay="autoplay"></video>{}
            <Button Text="start Video" onClick={this.thing} />
        </div>;
    }

    private stopRecording = () => {

    }

    private startRecording = () => {

    }

    private thing() {
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
                                deviceId: src.id,
                            },
                        }).then((stream: MediaStream) => {
                            if (video) {
                                video.srcObject = stream;
                                video.play();
                            }
                        });
                    return;
                }
            }
        });
    }
}
