import {app, dialog, Menu, MenuItem} from "electron";
import {currentBV} from './../browser/tabMng'
import addMenuItems from "./batchMenuItems";
import {getCurrentWindow} from "../browser/winCtrls";
import * as path from "path";

export default function getOtherActions(menu: Menu) {
    addMenuItems(menu, [
        new MenuItem({
            label: "Back",
            accelerator: "Alt+Right",
            enabled: currentBV.webContents.canGoBack(),
            click: function () {
                currentBV.webContents.goBack();
            }
        }),
        new MenuItem({
            label: "Forward",
            accelerator: "Alt+Left",
            enabled: currentBV.webContents.canGoForward(),
            click: function () {
                currentBV.webContents.goForward();
            }
        }),
        new MenuItem({
            label: "Reload",
            accelerator: "CommandOrControl+R",
            click: function () {
                currentBV.webContents.reload();
            }
        }),
        new MenuItem({
            type: 'separator'
        }),
        new MenuItem({
            label: "Save as...",
            accelerator: "CommandOrControl+S",
            click: function () {
                dialog.showSaveDialog(getCurrentWindow(), {
                    title: "Save Page",
                    defaultPath: path.join(app.getPath('documents'), 'index.html'),
                    filters: [{
                        name: "HTML (Complete Webpage)",
                        extensions: ['html']
                    }]
                }).then(result => {
                    currentBV.webContents.savePage(result.filePath, "HTMLComplete");
                })
            }
        }),
        new MenuItem({
            label: "Print...",
            accelerator: "CommandOrControl+P",
            click: function () {
                currentBV.webContents.print({}, function (success, failureReason) {
                    if (!success)
                        console.log(failureReason);
                })
            }
        }),
        new MenuItem({
            type: 'separator'
        }),
        new MenuItem({
            label: "View page source",
            accelerator: "CommandOrControl+U",
            click: function () {

            }
        })
    ])
}