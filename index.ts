import {BrowserWindow, app} from 'electron';
import * as electronIsDev from "electron-is-dev";
import registerKeyStrokes from './main/keystrokes';
import initCtxMenuService from './main/ctxMenus'
import initLoggerService from './main/logger'
import * as path from 'path';

function createWindow(): void {
    const win: BrowserWindow = new BrowserWindow({
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
    })
    win.show();

    win.setMenu(null);

    win.loadFile('window-ui/index.html')

    requireInitScripts();

    function requireInitScripts() {
        require('./main/browser/winCtrls')
        require('./main/browser/tabMng')
        registerKeyStrokes(win);
        initCtxMenuService(win);
        initLoggerService();
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        app.quit();
})

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length == 0)
        createWindow();
})