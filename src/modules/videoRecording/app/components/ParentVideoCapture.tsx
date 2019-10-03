import { desktopCapturer, DesktopCapturerSource, ipcRenderer } from "electron";
const fs = require("fs");
import * as React from "react";
import { Button } from "../../../../CORE/app/components/Button";

let mediaRecorder: any = null;
let recordedChunks: any[] = [];
const codec = " codecs=vp9";
const video = "video/webm";
export class ParentVideoCapture extends React.Component<{},
    {
        ButtonAction: any,
        ButtonText: string,
        DisplayId: string,
        PreviewActive: boolean,
        Recording: boolean,
        ScreenId: string,
        ShowPlayback: boolean,
        SuperBlob: Blob,
        VideoStream: any,
    }> {

    constructor(props: any) {
        super(props);
        this.state = {
            ButtonAction: () => { this.StartCapture(); },
            ButtonText: "Start Video Preview",
            DisplayId: "",
            PreviewActive: false,
            Recording: false,
            ScreenId: "",
            ShowPlayback: false,
            SuperBlob: null,
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
        let showStop = false;
        if (this.state.VideoStream !== undefined && this.state.VideoStream !== null) {
            showStop = true;
        }
        return <div>
            {/* <textarea id="Supported"></textarea> */}
            < video id="videoElement" controls style={{ maxWidth: "100%" }}></video>
            <Button Text={this.state.ButtonText}
                onClick={this.state.ButtonAction}
            />
            <div style={showStop ? null : { display: "none" }}>
                <Button Text="Stop Video" onClick={this.stopRecording} />
            </div>
            {/* <Button Text="Start Recording" onClick={this.startRecording} /> */}
            <div style={this.state.ShowPlayback ? null : { display: "none" }}>
                <Button Text="Playback Recording" onClick={this.playBackRecording} />
            </div>
            <div style={this.state.SuperBlob !== null ? null : { display: "none" }}>
                To save the recording, use the option on the player. This is being worked on currently.
                {/* <Button Text="Save Recording" onClick={() => { this.bigSave(); }} /> */}
            </div>
        </div>;
    }

    // --------------------------------------------------------------------------------

    private bigSave = () => {
        const blob = new Blob(recordedChunks, { type: video });
        const fileReader = new FileReader();
        fileReader.onload = function () {
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
                    ipcRenderer.send("balloon", { title: "Video", contents: "Failed to save video" });
                    ipcRenderer.send("logging", { Log: "Failed to save video: " + err});
                } else {
                    console.log("Saved video: " + file);
                    ipcRenderer.send("balloon", { title: "Video", contents: "Saved video: " + file });
                    ipcRenderer.send("logging", { Log: "Saved video: " + file});
                }
            });
        };
        fileReader.readAsArrayBuffer(blob);
    }

    private stopRecording = () => {
        const videoElement: HTMLVideoElement | null = document.getElementById("videoElement");
        if (videoElement.srcObject !== null) {
            videoElement.pause();
            videoElement.srcObject = null;
        }
        this.setState({
            ButtonAction: () => { this.StartCapture(); },
            ButtonText: "Start Video Preview. Will overwrite existing Recordings",
            ShowPlayback: true,
            VideoStream: null,
        });
        mediaRecorder.stop();
        this.balloon("Video", "Recording Stopped");
    }

    private startRecording = () => {
        const options = { mimeType: video + ";" + codec, videoBitsPerSecond: 500000 };
        recordedChunks.length = 0;
        if (this.state.VideoStream === undefined || this.state.VideoStream === null) {
            this.StartCapture();
        }
        mediaRecorder = new MediaRecorder(this.state.VideoStream, options);
        // this.checkSupportedMime();
        mediaRecorder.ondataavailable = this.handleDataAvailable;
        mediaRecorder.start();

        this.setState({
            ButtonAction: this.stopRecording,
            ButtonText: "Stop Recording",
            Recording: true,
            ShowPlayback: false,
            SuperBlob: null,
        });
        this.balloon("Video", "Started Recording");
    }

    private handleDataAvailable(event: any) {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    }

    private playBackRecording = () => {
        const videoElement: HTMLVideoElement | null = document.getElementById("videoElement");
        const superBuffer = new Blob(recordedChunks);
        videoElement.src = window.URL.createObjectURL(superBuffer);
        this.setState({ SuperBlob: superBuffer });
    }

    private StartCapture() {
        recordedChunks = [];
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
            const videoElement: HTMLVideoElement | null = document.getElementById("videoElement");
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
                            if (videoElement) {
                                videoElement.srcObject = stream;
                                videoElement.play();
                                this.setState({
                                    ButtonAction: this.startRecording,
                                    ButtonText: "Start Recording",
                                    ShowPlayback: false,
                                    VideoStream: stream,
                                });
                                this.balloon("Video", "Started Video preview");
                            }
                        });
                    return;
                }
            }
        });
    }

    private balloon = (Title: string, Contents: string) => {
        ipcRenderer.send("balloon", { title: Title, contents: Contents });
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
