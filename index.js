"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const isDev = require("electron-is-dev");
const index_1 = require("./main/components/menu/index");
require(__dirname + '/main/components/ipcEvents/index');
let countup;
let timer;
if (isDev) {
    countup = 0;
    timer = setInterval(function () {
        countup++;
    }, 1);
}
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 1280,
        height: 720,
        center: true,
        show: false,
        title: "Zinc",
        frame: false,
        backgroundColor: '#ffffff',
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true,
            enableRemoteModule: true,
            nodeIntegrationInSubFrames: true,
            devTools: isDev,
            v8CacheOptions: 'bypassHeatCheckAndEagerCompile'
        },
        minHeight: 80,
        minWidth: 180,
        icon: __dirname + '/artwork/Zinc.png',
    });
    electron_1.nativeTheme.themeSource = 'light';
    electron_1.app.setAsDefaultProtocolClient('zinc');
    electron_1.nativeTheme.themeSource = 'light';
    electron_1.app.setAsDefaultProtocolClient('zinc');
    win.loadFile('index/index.html');
    win.setMenu(null);
    win.webContents.on('did-finish-load', async () => {
        await win.show();
        require('./main/components/shortcuts/index');
        win.webContents.setFrameRate(60);
        win.on('resize', () => {
            win.webContents.setFrameRate(60);
        });
        win.on('will-resize', () => {
            win.webContents.setFrameRate(1);
        });
        win.once('show', () => {
            if (isDev) {
                console.log("Launched Zinc in  " + String(countup));
            }
        });
    });
    electron_1.ipcMain.on('webtitlechange', async (_event, args) => {
        win.title = "Zinc - " + String(args);
    });
    electron_1.ipcMain.on('webview:load', async (_event, args) => {
        electron_1.BrowserView.fromId(args).webContents.on('new-window', (event, url) => {
            event.preventDefault();
            electron_1.BrowserWindow.getFocusedWindow().webContents.send('new-tab', url);
        });
    });
    electron_1.ipcMain.on('home', async (_event, _args) => {
        index_1.closeMenu();
        electron_1.BrowserWindow.getFocusedWindow().webContents.send('home');
    });
}
electron_1.ipcMain.on('menu:open', async () => {
    index_1.openMenu();
});
electron_1.ipcMain.on('newtab', () => {
    index_1.closeMenu();
    electron_1.BrowserWindow.getFocusedWindow().webContents.send('new-tab', 'zinc://newtab');
});
electron_1.ipcMain.on('newwin', () => {
    electron_1.shell.openPath(electron_1.app.getPath('exe'));
});
electron_1.ipcMain.on('closetab', (_event, args) => {
    const currentwin = electron_1.BrowserWindow.getFocusedWindow();
    try {
        currentwin.removeBrowserView(electron_1.BrowserView.fromId(args[0]));
        currentwin.addBrowserView(electron_1.BrowserView.fromId(args[1]));
    }
    catch { }
});
electron_1.ipcMain.on('quit', (_event, args) => {
    switch (args) {
        case false:
            index_1.closeMenu();
            break;
        case true:
            index_1.closeMenu();
            electron_1.BrowserWindow.getFocusedWindow().close();
            break;
    }
    process.exit(0);
});
electron_1.ipcMain.on('about', (_event, _args) => {
    index_1.closeMenu();
    electron_1.app.setAboutPanelOptions({
        applicationName: "Zinc",
        applicationVersion: '0.1.0',
        authors: ["Zinc DevTeam"],
        iconPath: __dirname + '/artwork/Zinc.png',
    });
    electron_1.app.showAboutPanel();
});
electron_1.ipcMain.on('reloadpage', (_event, args) => {
    index_1.closeMenu();
    electron_1.BrowserWindow.getFocusedWindow().webContents.send('reloadpage', args);
});
electron_1.ipcMain.on('navi-history', () => {
    index_1.closeMenu();
    electron_1.BrowserWindow.getFocusedWindow().webContents.send('navi-history');
});
electron_1.app.whenReady().then(function () {
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0 && process.platform === 'darwin')
            electron_1.shell.openPath(electron_1.app.getPath('exe'));
    });
});
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.app.on('will-quit', () => {
    index_1.closeMenu();
});
