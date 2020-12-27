import WebSocket = require("ws");
import { ReceiveMessageTypes } from "./communicationData";
import defaultLogger, { LogLevel, LogTypes } from "../logger";
import StartupPerformance from "../dev/startupPerformance";

export default class NativeCommunication {

    private websocket: WebSocket = null;
    private readonly port: string = null;
    private readonly hostname: string = null;
    private readonly znPerformanceTimer: StartupPerformance = ((global as any).zincNativePerformanceTimer as StartupPerformance);
    public isReady: boolean = false;

    public constructor(port: string, hostname: string) {
        this.port = port;
        this.hostname = hostname;
    }

    public initialize(): void {
        this.websocket = new WebSocket(`ws://${this.hostname}:${this.port}`, {
            hostname: this.hostname,
            port: this.port,
            defaultPort: this.port,
            timeout: 1000
        });
        const self = this;

        this.websocket.on("close", function() {
            self.isReady = false;
            defaultLogger(LogTypes.ZincNative, "Connection lost", LogLevel.Error);
        });

        this.websocket.on("open", function() {
            defaultLogger(LogTypes.ZincNative, "Connected with Zinc Native", LogLevel.Log);
            self.znPerformanceTimer.splitStartup(function(startupTime) {
                defaultLogger(LogTypes.ZincNative, `Zinc Native Client connnected with Server in ${startupTime} ms`, LogLevel.Info);
            });
            this.send("InitializeZinc");
        });
        this.websocket.on('message', function (data) {
            defaultLogger(LogTypes.ZincNative, `Message from server ${data}`, LogLevel.Info);
            switch (ReceiveMessageTypes[data.toString()]) {
                case ReceiveMessageTypes.JavaLoaded:
                    self.isReady = true;
                    defaultLogger(LogTypes.ZincNative, "Checked the connection to Zinc Native", LogLevel.Log);
                    self.znPerformanceTimer.finishedStartup(function(startupTime) {
                        defaultLogger(LogTypes.ZincNative, `Zinc Native has finished starting up and done handshake in ${startupTime} ms`, LogLevel.Info);
                    });
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