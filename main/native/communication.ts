import WebSocket = require("ws");
import { ReceiveMessageTypes } from "./communicationData";
import defaultLogger, { LogLevel, LogTypes } from "../logger";

export default class NativeCommunication {

    private websocket: WebSocket = null;
    private readonly port: string = null;
    private readonly hostname: string = null;
    public isReady: boolean = false;

    public constructor(port: string, hostname: string) {
        this.port = port;
        this.hostname = hostname;
    }

    public initialize(): void {
        this.websocket = new WebSocket(`ws://${this.hostname}:${this.port}`)
        const self = this;

        this.websocket.on('close', function () {
            self.isReady = false;
            defaultLogger(LogTypes.ZincNative, "Connection lost", LogLevel.Error);
        })

        this.websocket.on('open', function () {
            defaultLogger(LogTypes.ZincNative, "Connected with Zinc Native", LogLevel.Log);
            this.send("InitializeZinc");
        })
        this.websocket.on('message', function (data) {
            defaultLogger(LogTypes.ZincNative, `[Zinc Native] Message from server ${data}`, LogLevel.Info);
            switch (ReceiveMessageTypes[data.toString()]) {
                case ReceiveMessageTypes.JavaLoaded:
                    self.isReady = true;
                    defaultLogger(LogTypes.ZincNative, "[Zinc Native] Checked the connection to Zinc Native", LogLevel.Log);
                    break;
            }
        })
    }

    public getWS(): WebSocket {
        return this.websocket;
    }

    public close(): void {
        this.websocket.close();
        this.websocket.terminate();
        this.websocket = null;
    }

}