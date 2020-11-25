import {getCurrentWindow} from "./winCtrls";
import {currentBV} from "./tabMng";

export default class TabWrapper {
    public static newTab(url: string): void {
        getCurrentWindow().webContents.send('tabwrapper-newtab', url);
    }

    public static closeTab(): void {
        getCurrentWindow().webContents.send('tabwrapper-closetab');
    }

    public static navigate(url: string) {
        currentBV.webContents.loadURL(url);
    }
}