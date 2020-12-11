import WebSocket = require('ws');
import {ReceiveMessageTypes} from "./communicationData";

export default class NativeCommunication {

    private websocket: WebSocket = null;
    private readonly port: string = null;
    private readonly hostname: string = null;

    public constructor(port: string, hostname: string) {
        this.port = port;
        this.hostname = hostname;
    }

    public initialize(): void {
        this.websocket = new WebSocket(`ws://${this.hostname}:${this.port}`)
        this.websocket.on('close', function () {
            console.log("[Zinc Native] Connection lost");
        })

        this.websocket.on('open', function () {
            this.send('InitializeZinc');
        })

        this.websocket.on('message', function (data) {
            switch (ReceiveMessageTypes[String(data)]) {
                case ReceiveMessageTypes.JavaLoaded:
                    console.log("[Zinc Native] Zinc Native loaded");
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