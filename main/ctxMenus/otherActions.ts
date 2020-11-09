import {Menu, MenuItem} from "electron";
import addMenuItems from "./batchMenuItems";

export default function getOtherActions(menu: Menu) {
    addMenuItems(menu, [
        new MenuItem({
            label: "Back",
            accelerator: "Alt+Right"
        }),
        new MenuItem({
            label: "Forward",
            accelerator: "Alt+Left"
        }),
        new MenuItem({
            label: "Reload"
        }),
        new MenuItem({
            type: 'separator'
        }),
        new MenuItem({
            label: "Save as..."
        }),
        new MenuItem({
            label: "Print..."
        }),
        new MenuItem({
            type: 'separator'
        }),
        new MenuItem({
            label: "View page source"
        })
    ])
}