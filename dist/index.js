"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electronIsDev = require("electron-is-dev");
const keystrokes_1 = require("./main/keystrokes");
const ctxMenus_1 = require("./main/ctxMenus");
const logger_1 = require("./main/logger");
const path = require("path");
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 1280,
        height: 720,
        title: "Zinc",
        frame: false,
        backgroundColor: '#ffffff',
        minHeight: 80,
        minWidth: 180,
        icon: path.join(__dirname, '..', 'artwork', 'Zinc.png'),
        show: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: false,
            devTools: electronIsDev
        }
    });
    win.show();
    win.setMenu(null);
    win.loadFile('window-ui/index.html');
    requireInitScripts();
    function requireInitScripts() {
        require('./main/browser/winCtrls');
        require('./main/browser/tabMng');
        keystrokes_1.default(win);
        ctxMenus_1.default(win);
        logger_1.default();
    }
}
electron_1.app.whenReady().then(createWindow);
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.app.on('activate', function () {
    if (electron_1.BrowserWindow.getAllWindows().length == 0)
        createWindow();
});
//# sourceMappingURL=index.js.map