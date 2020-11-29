import {app, BrowserWindow} from 'electron';
import * as electronIsDev from "electron-is-dev";
import registerKeyStrokes from './main/keystrokes';
import initLoggerService from './main/logger'
import initWinControls from './main/browser/winCtrls'
import initTabMNG from './main/browser/tabMng'
import initWinEvents from './main/window'
import initDevService from './main/dev'
import * as path from 'path';

function createWindow(): void {
    const win: BrowserWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        title: "Zinc",
        frame: false,
        backgroundColor: '#ffffff',
        minHeight: 60,
        minWidth: 180,
        icon: path.join(__dirname, '..', 'artwork', 'Zinc.png'),
        show: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: false,
            devTools: electronIsDev,
        }
    })

    win.setMenu(null);

    win.loadFile('window-ui/index.html')

    requireInitScripts();

    win.on('close', function () {
        if (BrowserWindow.getAllWindows().length < 1)
            app.quit();
    })

    function requireInitScripts() {
        initWinControls(win);
        initTabMNG(win);
        registerKeyStrokes(win);
        initLoggerService();
        initWinEvents(win);
        if (!app.isPackaged)
            initDevService(win);
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