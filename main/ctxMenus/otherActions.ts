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
            label: "Reload",
            accelerator: "CommandOrControl+R"
        }),
        new MenuItem({
            type: 'separator'
        }),
        new MenuItem({
            label: "Save as...",
            accelerator: "CommandOrControl+S"
        }),
        new MenuItem({
            label: "Print...",
            accelerator: "CommandOrControl+P"
        }),
        new MenuItem({
            type: 'separator'
        }),
        new MenuItem({
            label: "View page source",
            accelerator: "CommandOrControl+U"
        })
    ])
}