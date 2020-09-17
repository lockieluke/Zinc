const electron = require("electron");
const { app, BrowserWindow, ipcMain, globalShortcut, BrowserView, shell, Menu, MenuItem } = electron
const { registerProtocols } = require('./index/components/protocol/index')
const windowManager = require('electron-window-manager');
const isDev = require('electron-is-dev');

let menuShown = false, view = null;

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
        if (currentwin && currentwin.isFocused()) {
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
    const currentwin = BrowserWindow.getFocusedWindow()
    let menu = new Menu()

    menu.append(new MenuItem({
        label: "Back",
        click: async () => {
            currentwin.webContents.send('back')
        },
        accelerator: 'Alt+Left'
    }))

    menu.append(new MenuItem({
        label: "Forward",
        click: async () => {
            currentwin.webContents.send('forward')
        },
        accelerator: 'Alt+Right'
    }))

    menu.append(new MenuItem({
        label: "Reload",
        click: async () => {
            currentwin.webContents.send('reloadpage')
        },
        accelerator: "CommandOrControl+R"
    }))

    menu.append(new MenuItem({
        type: 'separator'
    }))

    menu.append(new MenuItem({
        label: "Save as...",
        click: async () => {
            currentwin.webContents.send('savepage')
        },
        accelerator: "CommandOrControl+S"
    }))

    menu.append(new MenuItem({
        label: "Print...",
        click: async () => {
            currentwin.webContents.send('print')
        },
        accelerator: "CommandOrControl+P"
    }))

    menu.append(new MenuItem({
        type: 'separator'
    }))

    menu.append(new MenuItem({
        label: "Inspect Element",
        click: async () => {
            currentwin.webContents.send('inspect-eli-cu', args)
        },
        accelerator: "CommandOrControl+Alt+Shift+I"
    }))

    menu.popup({ window: currentwin })

    menu.once('menu-will-close', async () => {
        menu = null
    })
})


ipcMain.on('textcontextmenu', async (_event, _args) => {
    const { textContextMenu } = require(__dirname + '/main/components/menu/index')
    textContextMenu()
})

ipcMain.on('imagecontextmenu', async (_event, _args) => {
    const { imageContextMenu } = require(__dirname + '/main/components/menu/index')
    imageContextMenu()
})

ipcMain.on('minimize', async () => {
    BrowserWindow.getFocusedWindow().minimize()
})

ipcMain.on('close', async () => {
    try {
        BrowserWindow.getFocusedWindow().close()
    } catch { }
})

ipcMain.on('menu:open', async () => {
    if (!view) {
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

    view.addListener('blur', closeMenu);
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
    if (args) {
        closeMenu()
        BrowserWindow.getFocusedWindow().close()
        delete BrowserWindow.getFocusedWindow()
    } else {
        closeMenu()
        closeAllWindows()
        app.quit()
        process.exit(0)
    }
})

ipcMain.on('about', async (_event, _args) => {
    closeMenu()
    app.setAboutPanelOptions({
        applicationName: "webby",
        applicationVersion: '0.1.0',
        authors: "Lockie Luke",
        iconPath: __dirname + 'artwork/Logo.png',
    });
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

app.whenReady().then(registerProtocols)

app.on('ready', async () => {
    windowManager.init()
});

app.on('window-all-closed', async () => {
    if (process.platform !== 'darwin') {
        closeMenu()
        closeAllWindows()
        app.quit()
        process.abort()
        app.exit(0)
    }
});

app.on('will-quit', async () => {
    closeMenu()
    closeAllWindows()
    app.quit()
    process.abort()
    app.exit(0)
});

app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0)
        shell.openPath(app.getPath('exe'))
});
