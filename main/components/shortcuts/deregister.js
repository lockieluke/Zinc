"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.BrowserWindow.getAllWindows()[0].on('blur', () => {
    electron_1.globalShortcut.unregisterAll();
});
//# sourceMappingURL=deregister.js.map