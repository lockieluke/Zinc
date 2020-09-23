import { BrowserWindow, app, nativeTheme, ipcMain, BrowserView, shell, Menu } from 'electron';
import * as isDev from 'electron-is-dev'
import { closeMenu, openMenu } from './main/components/menu/index'
import { sleep } from "./universal/utils/sleep/";
require(__dirname + '/main/components/ipcEvents/index')

let countup: number
let timer: NodeJS.Timeout;

if (isDev) {
    countup = 0
    timer = setInterval(() => {
        countup++
    }, 1)
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
    const win = new BrowserWindow({
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
    })

    nativeTheme.themeSource = 'dark';

    app.setAsDefaultProtocolClient('zinc')
    win.loadFile('index/index.html')
    win.setSkipTaskbar(true)
    win.setMenuBarVisibility(true)

    win.webContents.on('did-finish-load', () => {
        win.show()
        require('./main/components/shortcuts/index')
        win.webContents.setFrameRate(60)
        require('./main/components/menubar')

        let fadeIndex: number = 0
        for (let i = 0; i < 10; i++) {
            win.setOpacity(fadeIndex)
            fadeIndex++
            sleep(500)
        }
        win.setSkipTaskbar(false)

        win.once('show', () => {
            if (isDev) {
                console.log("Launched Zinc in  " + String(countup))
            }
        })
    })

    ipcMain.on('webtitlechange', async (_event, args) => {
        win.title = "Zinc - " + String(args)
    })

    ipcMain.on('webview:load', async (_event, args) => {
        BrowserView.fromId(args).webContents.on('new-window', (event, url) => {
            event.preventDefault()
            BrowserWindow.getAllWindows()[0].webContents.send('new-tab', url)
        })
    })

    ipcMain.on('home', async (_event, _args) => {
        closeMenu()
        BrowserWindow.getAllWindows()[0].webContents.send('home')
    })
}

ipcMain.on('menu:open', async () => {
    openMenu()
})

ipcMain.on('newtab', () => {
    closeMenu()
    BrowserWindow.getAllWindows()[0].webContents.send('new-tab', 'zinc://newtab')
})

ipcMain.on('newwin', () => {
    shell.openPath(app.getPath('exe'))
})

ipcMain.on('closetab', (_event, args) => {
    const currentwin = BrowserWindow.getAllWindows()[0]
    try {
        currentwin.removeBrowserView(BrowserView.fromId(args[0]))
        currentwin.addBrowserView(BrowserView.fromId(args[1]))
    } catch { }
})

ipcMain.on('quit', (_event, args) => {
    closeMenu()
    if (args) {
        BrowserWindow.getAllWindows()[0].close()
    }
    process.exit(0)
})

ipcMain.on('about', (_event, _args) => {
    closeMenu()
    app.setAboutPanelOptions({
        applicationName: "Zinc",
        applicationVersion: '0.1.0',
        authors: ["Zinc DevTeam"],
        iconPath: __dirname + '/artwork/Zinc.png',
    })
    app.showAboutPanel()
})

ipcMain.on('reloadpage', (_event, args) => {
    closeMenu()
    var win = BrowserWindow.getAllWindows()[0]
    if (win) {
        win.webContents.send('reloadpage', args)
    }
})

ipcMain.on('navi-history', () => {
    closeMenu()
    var win = BrowserWindow.getAllWindows()[0]
    if (win) {
        win.webContents.send('navi-history')
    }
})

app.whenReady().then(() => {
    init()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0 && process.platform === 'darwin') shell.openPath(app.getPath('exe'))
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('will-quit', closeMenu)
