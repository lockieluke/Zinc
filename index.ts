import electron = require("electron");
import { BrowserWindow, app, nativeTheme, ipcMain, BrowserView, shell, MenuItem, ipcRenderer } from 'electron';
import * as isDev from 'electron-is-dev'
import { closeMenu, openMenu } from './main/components/menu/index'
import electronIsDev = require('electron-is-dev');
require(__dirname + '/main/components/ipcEvents/index')

function createWindow() {
    const win: BrowserWindow = new BrowserWindow({
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
            webgl: true,
        },
        minHeight: 80,
        minWidth: 180,
        icon: __dirname + '/artwork/Zinc.png'
    })

    // menu =>
    const menu = new electron.Menu()
    menu.append(new MenuItem({
        label: 'quit',
        accelerator: 'CmdorCtrl+P',
        click: () => { ipcRenderer.send("quit", false) }
    }));

    nativeTheme.themeSource = 'light'

    app.setAsDefaultProtocolClient('zinc')
    win.loadFile('index/index.html')
    win.setMenu(menu);

    win.webContents.on('did-finish-load', async () => {
        win.show()
    })

    ipcMain.on('webtitlechange', async (_event, args) => {
        win.title = "Zinc - " + args.toString()
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
    const currentwin = BrowserWindow.getFocusedWindow()
    try {
        currentwin.removeBrowserView(BrowserView.fromId(args[0]))
        currentwin.addBrowserView(BrowserView.fromId(args[1]))
    } catch { }
})

ipcMain.on('quit', (_event, args) => {
    switch (args) {
        case false:
            closeMenu()
            break

        case true:
            closeMenu()
            BrowserWindow.getAllWindows()[0].close()
            break
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
    createWindow()


    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0 && process.platform === 'darwin') shell.openPath(app.getPath('exe'))
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('will-quit', closeMenu)
