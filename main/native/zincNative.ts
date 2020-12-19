import NativeCommunication from './communication';
import * as path from 'path';
import getAppRoot from '../utils/appPath';

export class ZincNative {

    private nativeCommunication: NativeCommunication;
    private app: Electron.App;

    public constructor(nativeCommuniction: NativeCommunication, app: Electron.App) {
        this.nativeCommunication = nativeCommuniction;
        this.app = app;
    }

    public changeRPCDescription(description: string): void {
        this.nativeCommunication.getWS().send(`custom:ChangeRPCDescription:${description}`);
    }

    public getJarPath(): string {
        if (!this.app.isPackaged) {
            return path.join(getAppRoot(), 'native', 'ZincNative.jar');
        } else {
            return path.join(path.dirname(this.app.getPath('exe')), 'native', 'ZincNative.jar');
        }
    }
}