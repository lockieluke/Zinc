import {Menu, MenuItem} from "electron";
import getLinkActionsCTX from "./linkActions";
import getImgActionsCTX from "./imgActions";
import addMenuItems from "./batchMenuItems";
import getTfActions from "./tfActions";
import getOtherActions from "./otherActions";

export default function main(bv: Electron.BrowserView, window: Electron.BrowserWindow) {
    bv.webContents.on('context-menu', function (event, param) {
        let menu: Menu = new Menu();
        if (param.linkURL !== '') {
            //Link Actions
            getLinkActionsCTX(menu)
        } else if (param.hasImageContents) {
            //Image Actions
            getImgActionsCTX(menu);
        } else if (param.isEditable) {
            //TextField Actions
            getTfActions(menu);
        } else if (!param.isEditable && param.selectionText !== '') {
            //Just Copy Actions
            menu.append(new MenuItem({
                label: "Copy"
            }))
        } else if (param.selectionText !== '') {
            //Selected Text Actions
            getTfActions(menu, param.selectionText);
        } else if (!param.hasImageContents && param.linkURL === '' && param.selectionText === '' && !param.isEditable) {
            //Other Actions
            getOtherActions(menu);
        }
        addMenuItems(menu, [
            new MenuItem({
                type: 'separator'
            }),
            new MenuItem({
                label: "Inspect Element",
                accelerator: "CommandOrControl+Shift+I"
            })
        ])
        menu.on('menu-will-close', function () {
            menu = null;
        })
        menu.popup({
            window: window
        })
    })
}