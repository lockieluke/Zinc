import NativeCommunication from "./communication";
import * as path from "path";
import getAppRoot from "../utils/appPath";
import { getJavaPath, runJar } from "./java";
import defaultLogger from "../logger/";
import { LogLevel, LogTypes } from "../logger";

interface DiscordRPC {
    zincNative: ZincNative
    changeRPCDescription: Function,
}

export default class ZincNative {

    private nativeCommunication: NativeCommunication;
    private readonly app: Electron.App;

    public constructor(nativeCommuniction: NativeCommunication, app: Electron.App) {
        this.nativeCommunication = nativeCommuniction;
        this.app = app;
    }

    public startup(): void {
        // Windows is the only platform which supports Zinc Native for now
        if (process.env.NO_NATIVE_JAR !== "true" && process.platform === "win32") {
            const jarPath: string = this.getJarPath(), javaPath: string = getJavaPath(this.app);
            defaultLogger(LogTypes.ZincNative, `Starting bundled Zinc Native which is placed in ${jarPath} with JVM in ${javaPath}`, LogLevel.Log);
            runJar(javaPath, jarPath, "", function(stderr) {
                defaultLogger(LogTypes.ZincNative, stderr, LogLevel.Error);
            }, function(stdout) {
                defaultLogger(LogTypes.ZincNative, stdout);
            }, function(exitcode) {
                defaultLogger(LogTypes.ZincNative, exitcode.toString(), LogLevel.Info);
            });
        } else {
            defaultLogger(LogTypes.ZincNative, "Zinc Native is currently not supported on other platforms", LogLevel.Info);
        }
    }

    public DiscordRPC: DiscordRPC = {
        zincNative: <ZincNative>(this as ZincNative),
        changeRPCDescription: function(description: string): void {
            this.zincNative.nativeCommunication.getWS().send(`custom:ChangeRPCDescription:${description}`);
        }
    };

    public getJarPath(): string {
        if (!this.app.isPackaged) {
            return path.join(getAppRoot(), 'native', 'ZincNative.jar');
        } else {
            return path.join(path.dirname(this.app.getPath('exe')), 'native', 'ZincNative.jar');
        }
    }
}