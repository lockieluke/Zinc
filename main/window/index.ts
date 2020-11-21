import {BrowserWindow} from "electron";

export default function main() {
    const currenwin = BrowserWindow.getFocusedWindow();
    currenwin.on('resize', function () {
        currenwin.webContents.send('win-resize-updated');
    })
}