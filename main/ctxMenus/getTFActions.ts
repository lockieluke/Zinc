import {Menu, MenuItem} from "electron";
import addMenuItems from "./batchMenuItems";

export default function getTFActions(menu: Menu, textContent: string = "") {
    addMenuItems(menu, [
        new MenuItem({
            label: "Emoji"
        }),
        new MenuItem({
           type: 'separator'
        }),
        new MenuItem({
            label: "Undo"
        }),
        new MenuItem({
            label: "Undo"
        }),
        new MenuItem({
            label: "Redo"
        }),
        new MenuItem({
            type: 'separator'
        }),
        new MenuItem({
            label: "Cut"
        }),
        new MenuItem({
            label: "Copy"
        }),
        new MenuItem({
            label: "Paste"
        }),
        new MenuItem({
            label: "Select All"
        }),
    ])
}