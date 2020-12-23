import { clipboard, Menu, MenuItem } from "electron";
import addMenuItems from "./batchMenuItems";
import TabWrapper from "../browser/tabWrapper";
import { currentBV } from "../browser/tabMng";

export default function getImgActionsCTX(
  menu: Menu,
  params: Electron.ContextMenuParams,
) {
  addMenuItems(menu, [
    new MenuItem({
      label: 'Open image in new tab',
      click: function () {
        TabWrapper.newTab(params.srcURL);
      },
    }),
    new MenuItem({
      label: 'Save as image...',
      click: function () {
        currentBV.webContents.downloadURL(params.srcURL);
      },
    }),
    new MenuItem({
      label: 'Copy image',
      click: function () {
        currentBV.webContents.copyImageAt(params.x, params.y);
      },
    }),
    new MenuItem({
      label: 'Copy image link',
      click: function () {
        clipboard.writeText(params.srcURL);
      },
    }),
  ]);
}
