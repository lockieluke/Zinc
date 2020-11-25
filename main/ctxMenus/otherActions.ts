import {dialog, Menu, MenuItem} from "electron";
import {currentBV} from './../browser/tabMng'
import addMenuItems from "./batchMenuItems";
import {getCurrentWindow} from "../browser/winCtrls";
import * as path from "path";
import TabWrapper from "../browser/tabWrapper";

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
            click: async function () {
                const {canceled, filePath} = await dialog.showSaveDialog(getCurrentWindow(), {
                    defaultPath: currentBV.webContents.getTitle(),
                    filters: [
                        {name: "Webpage, Complete", extensions: ['html', 'htm']},
                        {name: "Webpage, HTML Only", extensions: ['html', 'htm']}
                    ],
                    title: "Save As"
                });

                if (canceled) return;

                currentBV.webContents.savePage(filePath, path.extname(filePath) === '.htm' ? 'HTMLOnly' : 'HTMLComplete');
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
                TabWrapper.newTab('view-source:' + currentBV.webContents.getURL());
            }
        })
    ])
}