import WebSocket = require('ws');
import {ReceiveMessageTypes} from "./communicationData";

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
            console.log("[Zinc Native] Connection lost");
        })

        this.websocket.on('open', function () {
            console.log("[Zinc Native] Connected with Zinc Native");
            this.send('InitializeZinc');
        })
        this.websocket.on('message', function (data) {
            console.log(`[Zinc Native] Message from server ${data}`);
            switch (ReceiveMessageTypes[data.toString()]) {
                case ReceiveMessageTypes.JavaLoaded:
                    self.isReady = true;
                    console.log("[Zinc Native] Checked the connection to Zinc Native");
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