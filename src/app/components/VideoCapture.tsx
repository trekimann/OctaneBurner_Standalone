import { desktopCapturer, DesktopCapturerSource, ipcRenderer } from "electron";
const fs = require("fs");
import * as React from "react";
import { Button } from "./Button";

let mediaRecorder: any = null;
const recordedChunks: any[] = [];
const codec = " codecs=vp9";
const video = "video/webm";
export class VideoCapture extends React.Component<{}, { DisplayId: string, ScreenId: string, VideoStream: any }> {

    constructor(props: any) {
        super(props);
        this.state = {
            DisplayId: "",
            ScreenId: "",
            VideoStream: null,
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
            {/* <textarea id="Supported"></textarea> */}
            <video controls style={{ maxWidth: "100%" }}></video>
            <Button Text="Start Video Stream" onClick={() => this.thing()} />
            <Button Text="Stop Video" onClick={this.stopRecording} />
            <Button Text="Start Recording" onClick={this.startRecording} />
            <Button Text="Playback Recording" onClick={this.playBackRecording} />
            <Button Text="Save Recording" onClick={this.bigSave} />
        </div >;
    }

    private bigSave = () => {
        const blob = new Blob(recordedChunks, { type: video });
        const fileReader = new FileReader();
        fileReader.onload = function() {
            const ab = this.result;
            const buffer = new Buffer(ab.byteLength);
            const arr = new Uint8Array(ab);
            for (let i = 0; i < arr.byteLength; i++) {
                buffer[i] = arr[i];
            }
            const file = `./videos/example.webm`;
            fs.writeFile(file, buffer, (err) => {
                if (err) {
                    console.error("Failed to save video " + err);
                } else {
                    console.log("Saved video: " + file);
                }
            });
        };
        fileReader.readAsArrayBuffer(blob);
    }

    private stopRecording = () => {
        const video: HTMLVideoElement | null = document.querySelector("video");
        if (video.srcObject !== null) {
            video.pause();
            video.srcObject = null;
        }
        mediaRecorder.stop();
    }

    private startRecording = () => {
        const options = { mimeType: video + ";" + codec, videoBitsPerSecond: 500000 };
        recordedChunks.length = 0;
        mediaRecorder = new MediaRecorder(this.state.VideoStream, options);
        // this.checkSupportedMime();
        mediaRecorder.ondataavailable = this.handleDataAvailable;
        mediaRecorder.start();
    }

    private handleDataAvailable(event: any) {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    }

    private playBackRecording = () => {
        const video: HTMLVideoElement | null = document.querySelector("video");
        const superBuffer = new Blob(recordedChunks);
        video.src = window.URL.createObjectURL(superBuffer);
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
                                // deviceId: src.id,
                                mandatory: {
                                    chromeMediaSource: "desktop",
                                    chromeMediaSourceId: src.id,
                                },
                            },
                        }).then((stream: MediaStream) => {
                            if (video) {
                                video.srcObject = stream;
                                video.play();
                                this.setState({ VideoStream: stream });
                            }
                        });
                    return;
                }
            }
        });
    }

    private checkSupportedMime = () => {
        const contentTypes = ["video/webm",
            "video/webm;codecs=vp8",
            "video/webm;codecs=vp9",
            "video/webm;codecs=vp10",
            "video/x-matroska;codecs=avc1",
            "video/mp4;codecs=avc1",
            "video/mp4",
            "video/invalid"];
        const text = document.getElementById("Supported");
        contentTypes.forEach((contentType) => {
            text.value += contentType + " is " + (MediaRecorder.isTypeSupported(contentType) ?
                "supported\n" : "NOT supported \n");
        });
    }
}
