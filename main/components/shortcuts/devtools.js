"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDevToolShortcuts = void 0;
const electron_1 = require("electron");
function registerDevToolShortcuts() {
    electron_1.globalShortcut.register('CommandOrControl+Shift+I', () => {
        electron_1.BrowserWindow.getFocusedWindow().webContents.openDevTools({
            mode: 'detach'
        });
    });
    electron_1.globalShortcut.register('CommandOrControl+Alt+Shift+I', () => {
        electron_1.BrowserWindow.getFocusedWindow().webContents.send('webview-devtools');
    });
}
exports.registerDevToolShortcuts = registerDevToolShortcuts;
//# sourceMappingURL=devtools.js.map