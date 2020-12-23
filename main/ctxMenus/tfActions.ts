import { app, Menu, MenuItem } from "electron";
import addMenuItems from "./batchMenuItems";

export default function getTfActions(
  menu: Menu,
  params: Electron.ContextMenuParams,
) {
  if (process.platform === 'win32') {
    addMenuItems(menu, [
      new MenuItem({
        label: 'Emoji',
        sublabel: 'Win + Period',
        click: function () {
          app.showEmojiPanel();
        },
      }),
      new MenuItem({
        type: 'separator',
      }),
    ]);
  }
  addMenuItems(menu, [
    new MenuItem({
      label: 'Undo',
      accelerator: 'CommandOrControl+Z',
      role: 'undo',
    }),
    new MenuItem({
      label: 'Redo',
      accelerator: 'CommandOrControl+Y',
      role: 'redo',
    }),
    new MenuItem({
      type: 'separator',
    }),
    new MenuItem({
      label: 'Cut',
      accelerator: 'CommandOrControl+X',
      role: 'cut',
    }),
    new MenuItem({
      label: 'Copy',
      accelerator: 'CommandOrControl+C',
      role: 'copy',
    }),
    new MenuItem({
      label: 'Paste',
      accelerator: 'CommandOrControl+V',
      role: 'pasteAndMatchStyle',
    }),
    new MenuItem({
      label: 'Paste as plain text',
      accelerator: 'CommandOrControl+Shift+V',
      role: 'paste',
    }),
    new MenuItem({
      label: 'Select All',
      accelerator: 'CommandOrControl+A',
      role: 'selectAll',
    }),
  ]);
}
