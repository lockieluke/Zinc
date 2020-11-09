import {Menu, MenuItem} from "electron";
import addMenuItems from "./batchMenuItems";

export default function getImgActionsCTX(menu: Menu) {
    addMenuItems(menu, [
        new MenuItem({
            label: "Open image in new tab"
        }),
        new MenuItem({
            label: "Save as image..."
        }),
        new MenuItem({
            label: "Copy image"
        }),
        new MenuItem({
            label: "Copy image link"
        })
    ])
}