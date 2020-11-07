"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const currentwin = electron_1.BrowserWindow.getFocusedWindow();
electron_1.ipcMain.on('win-close', function () {
    currentwin.close();
});
electron_1.ipcMain.on('win-max', function () {
    if (currentwin.isMaximized()) {
        currentwin.unmaximize();
    }
    else {
        currentwin.maximize();
    }
});
electron_1.ipcMain.on('win-min', function () {
    currentwin.minimize();
});
//# sourceMappingURL=winCtrls.js.map