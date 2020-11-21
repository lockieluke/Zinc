import {BrowserWindow} from "electron";

export default function main(window: BrowserWindow) {
    window.on('resize', function () {
        window.webContents.send('win-resize-updated');
    })
}