"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const isDev = require("electron-is-dev");
const index_1 = require("./main/components/menu/index");
const sleep_1 = require("./universal/utils/sleep/");
require(__dirname + '/main/components/ipcEvents/index');
let countup;
let timer;
if (isDev) {
    countup = 0;
    timer = setInterval(() => {
        countup++;
    }, 1);
}
// const menuTemplate: object = [
//     {
//         label: '&File',
//         submenu: [
//             {
//                 accelerator: 'CmdOrCtrl+Q',
//                 role: 'quit',
//             }
//         ]
//     },
//     {
//         label: '&Edit',
//         submenu: [
//             {
//                 role: 'undo'
//             },
//             {
//                 role: 'redo'
//             },
//             {
//                 type: 'separator'
//             },
//             {
//                 role: 'cut'
//             },
//             {
//                 role: 'copy'
//             },
//             {
//                 role: 'paste'
//             }
//         ]
//     },
//     {
//         label: '&View',
//         submenu: [
//             {
//                 role: 'reload'
//             },
//             {
//                 role: 'toggledevtools'
//             },
//             {
//                 type: 'separator'
//             },
//             {
//                 role: 'resetzoom'
//             },
//             {
//                 role: 'zoomin'
//             },
//             {
//                 role: 'zoomout'
//             },
//             {
//                 type: 'separator'
//             },
//             {
//                 role: 'togglefullscreen'
//             }
//         ]
//     },
//     {
//         role: '&Window',
//         submenu: [{role: 'minimize'}, {role: 'close'}]
//     },
//     {
//         role: '&Help',
//         submenu: [{label: 'Learn More'}]
//     }
// ]
function init() {
    const win = new electron_1.BrowserWindow({
        width: 1280,
        height: 720,
        center: true,
        show: false,
        title: "Zinc",
        frame: false,
        backgroundColor: '#ffffff',
        webPreferences: {
            worldSafeExecuteJavaScript: true,
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
        opacity: 0
    });
    electron_1.nativeTheme.themeSource = 'dark';
    electron_1.app.setAsDefaultProtocolClient('zinc');
    win.loadFile('index/index.html');
    win.setSkipTaskbar(true);
    win.setMenuBarVisibility(true);
    win.webContents.on('did-finish-load', () => {
        win.show();
        require('./main/components/shortcuts/index');
        win.webContents.setFrameRate(60);
        require('./main/components/menubar');
        let fadeIndex = 0;
        for (let i = 0; i < 10; i++) {
            win.setOpacity(fadeIndex);
            fadeIndex++;
            sleep_1.sleep(500);
        }
        win.setSkipTaskbar(false);
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
            electron_1.BrowserWindow.getAllWindows()[0].webContents.send('new-tab', url);
        });
    });
    electron_1.ipcMain.on('home', async (_event, _args) => {
        index_1.closeMenu();
        electron_1.BrowserWindow.getAllWindows()[0].webContents.send('home');
    });
}
electron_1.ipcMain.on('menu:open', async () => {
    index_1.openMenu();
});
electron_1.ipcMain.on('newtab', () => {
    index_1.closeMenu();
    electron_1.BrowserWindow.getAllWindows()[0].webContents.send('new-tab', 'zinc://newtab');
});
electron_1.ipcMain.on('newwin', () => {
    electron_1.shell.openPath(electron_1.app.getPath('exe'));
});
electron_1.ipcMain.on('closetab', (_event, args) => {
    const currentwin = electron_1.BrowserWindow.getAllWindows()[0];
    try {
        currentwin.removeBrowserView(electron_1.BrowserView.fromId(args[0]));
        currentwin.addBrowserView(electron_1.BrowserView.fromId(args[1]));
    }
    catch { }
});
electron_1.ipcMain.on('quit', (_event, args) => {
    index_1.closeMenu();
    if (args) {
        electron_1.BrowserWindow.getAllWindows()[0].close();
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
    var win = electron_1.BrowserWindow.getAllWindows()[0];
    if (win) {
        win.webContents.send('reloadpage', args);
    }
});
electron_1.ipcMain.on('navi-history', () => {
    index_1.closeMenu();
    var win = electron_1.BrowserWindow.getAllWindows()[0];
    if (win) {
        win.webContents.send('navi-history');
    }
});
electron_1.app.whenReady().then(() => {
    init();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0 && process.platform === 'darwin')
            electron_1.shell.openPath(electron_1.app.getPath('exe'));
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.app.on('will-quit', index_1.closeMenu);
//# sourceMappingURL=index.js.map