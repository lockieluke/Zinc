const { app, BrowserWindow, ipcMain, globalShortcut, BrowserView, shell, Menu, MenuItem } = require('electron')
const { registerProtocols } = require('./index/components/protocol/index')
const windowManager = require('electron-window-manager')
const isDev = require('electron-is-dev');
const { textContextMenu, imageContextMenu, defContextMenu, anchorContextMenu } = require(__dirname + '/main/components/menu/index')

let menuShown = false
let view = null

app.commandLine.appendSwitch('--enable-transparent-visuals');
app.commandLine.appendSwitch('--enable-parallel-downloading');

async function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        center: true,
        transparent: false,
        show: false,
        title: "webby",
        frame: false,
        hasShadow: true,
        backgroundColor: '#ffffff',
        resizable: true,
        autoHideMenuBar: false,
        paintWhenInitiallyHidden: true,
        webPreferences: {
            spellcheck: true,
            nodeIntegration: true,
            webviewTag: true,
            enableRemoteModule: true,
            nodeIntegrationInSubFrames: true,
            scrollBounce: true,
            devTools: isDev,
            allowRunningInsecureContent: true,
            backgroundThrottling: true,
            webgl: true,
            autoplayPolicy: 'no-user-gesture-required'
        },
        minHeight: 80,
        minWidth: 180,
        icon: __dirname + '/artwork/Logo.png'
    })

    const electron = require('electron')
    const session = electron.session

    const filter = {
        urls: ["http://*/*", "https://*/*"]
    }
    session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
        details.requestHeaders['DNT'] = "1";
        callback({ cancel: false, requestHeaders: details.requestHeaders })
    })

    app.setAsDefaultProtocolClient('webby')

    win.loadFile('index/index.html')

    win.setMenu(null)

    win.webContents.on('did-finish-load', async () => {
        win.show()
    })

    ipcMain.on('webtitlechange', async (_event, args) => {
        win.focus()
        win.title = "webby - " + args.toString()
    })

    ipcMain.on('webview:load', async (_event, args) => {
        BrowserView.fromId(args).webContents.on('new-window', (event, url) => {
            event.preventDefault()
            BrowserWindow.getFocusedWindow().webContents.send('new-tab', url)
        })
    })

    ipcMain.on('home', async (_event, _args) => {
        closeMenu()
        BrowserWindow.getFocusedWindow().webContents.send('home')
    })

    globalShortcut.register("CommandOrControl+Shift+I", async () => {
        const currentwin = BrowserWindow.getFocusedWindow()
        if (currentwin.isFocused()) {
            currentwin.webContents.openDevTools({
                activate: true,
                mode: "detach"
            })
        } else if (menuShown) {
            view.webContents.openDevTools({
                activate: true,
                mode: "detach"
            })
        }
    })
}

async function closeMenu() {
    try {
        view.close()
        view.destroy()
        view = null
        menuShown = false
        window.focus();
    } catch { }
}

ipcMain.on('togglemax', async () => {
    const currentwin = BrowserWindow.getFocusedWindow()
    if (currentwin.isMaximized()) {
        currentwin.unmaximize()
    } else {
        currentwin.maximize()
    }
})

ipcMain.on('contextmenu', async (_event, args) => {
    defContextMenu(args)
})

ipcMain.on('textcontextmenu', async (_event, args) => {
    textContextMenu(args)
})

ipcMain.on('imagecontextmenu', async (_event, args) => {
    imageContextMenu(args)
})

ipcMain.on('anchorcontextmenu', async (_event, args) => {
    anchorContextMenu(args)
})

ipcMain.on('minimize', () => {
    BrowserWindow.getFocusedWindow().minimize()
})

ipcMain.on('close', () => {
    try {
        BrowserWindow.getFocusedWindow().close()
    } catch { }
})

ipcMain.on('menu:open', async () => {
    if (view != null) return

    if (view == null) {
        view = new BrowserWindow({
            title: "Menu",
            modal: true,
            opacity: 0.9,
            skipTaskbar: true,
            parent: 'top',
            width: 300,
            height: 300,
            center: false,
            transparent: true,
            frame: false,
            resizable: false,
            paintWhenInitiallyHidden: true,
            maximizable: false,
            closable: false,
            movable: false,
            titleBarStyle: 'hidden',
            show: false,
            webPreferences: {
                nodeIntegration: true
            }
        })
    }

    app.allowRendererProcessReuse = false

    view.webContents.loadFile('menu/index.html')

    view.webContents.on('dom-ready', async () => {
        const currentwin = BrowserWindow.getFocusedWindow()
        menuShown = true
        await view.show()
        switch (currentwin.isMaximized()) {
            case true:
                view.setPosition(currentwin.getPosition()[0] + 10, currentwin.getPosition()[1] + 35)
                break

            case false:
                view.setPosition(currentwin.getPosition()[0], currentwin.getPosition()[1] + 25)
                break
        }
    })

    view.addListener('blur', () => {
        closeMenu()
    })
})

ipcMain.on('newtab', async () => {
    closeMenu()
    BrowserWindow.getFocusedWindow().webContents.send('new-tab', 'webby://newtab')
})

ipcMain.on('newwin', async () => {
    shell.openPath(app.getPath('exe'))
})

ipcMain.on('closetab', async (_event, args) => {
    const currentwin = BrowserWindow.getFocusedWindow()
    try {
        currentwin.removeBrowserView(BrowserView.fromId(args[0]))
        currentwin.addBrowserView(BrowserView.fromId(args[1]))
    } catch { }
})

ipcMain.on('quit', async (_event, args) => {
    switch (args) {
        case false:
            closeMenu()
            closeAllWindows()
            app.quit()
            process.exit(0)
            break

        case true:
            closeMenu()
            BrowserWindow.getFocusedWindow().close()
            delete BrowserWindow.getFocusedWindow()
            break
    }
})

ipcMain.on('about', (_event, _args) => {
    closeMenu()
    app.setAboutPanelOptions({
        applicationName: "webby",
        applicationVersion: '0.1.0',
        authors: "Lockie Luke",
        iconPath: __dirname + 'artwork/Logo.png',
    })
    app.showAboutPanel()
})

ipcMain.on('reloadpage', async (_event, args) => {
    closeMenu()
    BrowserWindow.getFocusedWindow().webContents.send('reloadpage', args)
})

ipcMain.on('navi-history', async () => {
    closeMenu()
    BrowserWindow.getFocusedWindow().webContents.send('navi-history')
})

function closeAllWindows() {
    for (let i = 0; i < BrowserWindow.getAllWindows().length; i++) {
        BrowserWindow.getAllWindows()[i].close()
    }
}

app.whenReady().then(createWindow)

app.whenReady().then(() => {
    registerProtocols()
})

app.on('ready', async () => {
    windowManager.init()
})

app.on('window-all-closed', async () => {
    if (process.platform !== 'darwin') {
        closeMenu()
        closeAllWindows()
        app.quit()
        process.abort()
        app.exit(0)
    }
})

app.on('will-quit', async () => {
    closeMenu()
    closeAllWindows()
    app.quit()
    process.abort()
    app.exit(0)
})

app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0)
        shell.openPath(app.getPath('exe'))
})
