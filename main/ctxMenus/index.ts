import {ipcMain, Menu, MenuItem} from "electron";

export default function main(window: Electron.BrowserWindow) {

    let menu = new Menu();
    menu.append(new MenuItem({
        label: "HELLO"
    }))

    ipcMain.on('ctxmenu', function () {
        menu.popup({
            window: window
        })
    })
}