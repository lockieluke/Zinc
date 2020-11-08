import {Menu, MenuItem} from "electron";
import addMenuItems from "./batchMenuItems";

export default function getLinkActionsCTX(menu: Menu) {
    addMenuItems(menu, [
        new MenuItem({
            label: "Open link in new tab"
        }),
        new MenuItem({
            label: "Open link in new window"
        }),
        new MenuItem({
            label: "Save link as..."
        }),
        new MenuItem({
            label: "Copy link"
        })
    ])
}