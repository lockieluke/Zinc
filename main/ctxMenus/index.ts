import {Menu} from "electron";
import getLinkActionsCTX from "./linkActions";

export default function main(bv: Electron.BrowserView, window: Electron.BrowserWindow) {
    bv.webContents.on('context-menu', function (event, param) {
        const menu = new Menu();
        if (param.linkURL !== '') {
            //Link Actions
            getLinkActionsCTX(menu)
        } else if (param.hasImageContents) {
            //Image Actions
        } else if (param.isEditable) {
            //TextField Actions
        } else if (!param.isEditable && param.selectionText !== '') {
            //Just Copy Actions
        } else if (param.selectionText !== '') {
            //Selected Text Actions
        } else if (!param.hasImageContents && param.linkURL === '' && param.selectionText === '' && !param.isEditable) {
            //Other Actions
        }
        menu.popup({
            window: window
        })
    })
}