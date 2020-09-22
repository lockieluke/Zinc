"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const devtools_1 = require("./devtools");
electron_1.BrowserWindow.getAllWindows()[0].on('focus', () => {
    electron_1.globalShortcut.unregisterAll();
    devtools_1.registerDevToolShortcuts();
});
//# sourceMappingURL=register.js.map