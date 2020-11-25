import {Menu, MenuItem} from "electron";
import getLinkActionsCTX from "./linkActions";
import getImgActionsCTX from "./imgActions";
import addMenuItems from "./batchMenuItems";
import getTfActions from "./tfActions";
import getOtherActions from "./otherActions";
import {mouseEvent} from "../browser/mouseEvent";


export default function main(window: Electron.BrowserWindow, bv: Electron.BrowserView, param: Electron.ContextMenuParams) {
    let menu: Menu = new Menu();
    if (param.linkURL !== '') {
        //Link Actions
        getLinkActionsCTX(menu, param);
    }
    if (param.hasImageContents) {
        if (param.linkURL !== '')
            menu.append(new MenuItem({
                type: 'separator'
            }));
        //Image Actions
        getImgActionsCTX(menu, param);
    }
    if (param.isEditable || param.selectionText !== '') {
        //TextField Actions
        getTfActions(menu, param);
    }
    if (!param.isEditable && param.selectionText !== '') {
        //Just Copy Actions
        menu.append(new MenuItem({
            label: "Copy"
        }))
    }
    if (!param.hasImageContents && param.linkURL === '' && param.selectionText === '' && !param.isEditable) {
        //Other Actions
        getOtherActions(menu);
    }
    addMenuItems(menu, [
        new MenuItem({
            type: 'separator'
        }),
        new MenuItem({
            label: "Inspect Element",
            accelerator: "CommandOrControl+Shift+I",
            click: function () {
                bv.webContents.inspectElement(mouseEvent.getMouseX(), mouseEvent.getMouseY());
            }
        })
    ])
    menu.popup({
        window: window
    })
}