import {Menu, MenuItem} from "electron";
import addMenuItems from "./batchMenuItems";

export default function getTfActions(menu: Menu, textContent: string = "") {
    if (process.platform === 'win32') {
        addMenuItems(menu, [
            new MenuItem({
                label: "Emoji",
                sublabel: "Win + Period"
            }),
            new MenuItem({
                type: 'separator'
            })
        ])
    }
    addMenuItems(menu, [
        new MenuItem({
            label: "Undo",
            accelerator: "CommandOrControl+Z"
        }),
        new MenuItem({
            label: "Redo",
            accelerator: "CommandOrControl+Y"
        }),
        new MenuItem({
            type: 'separator'
        }),
        new MenuItem({
            label: "Cut",
            accelerator: "CommandOrControl+X"
        }),
        new MenuItem({
            label: "Copy",
            accelerator: "CommandOrControl+C"
        }),
        new MenuItem({
            label: "Paste",
            accelerator: "CommandOrControl+V"
        }),
        new MenuItem({
            label: "Select All",
            accelerator: "CommandOrControl+A"
        }),
    ])
}