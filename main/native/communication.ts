import WebSocket = require('ws');

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

        this.websocket.on('open', function () {
            this.send('zinc');
        })
    }

    public close(): void {
        this.websocket.close();
        this.websocket.terminate();
        this.websocket = null;
    }

}