const {app, BrowserWindow, ipcMain, globalShortcut, BrowserView, shell, Menu, MenuItem} = require('electron')
const {registerProtocols} = require('./index/components/protocol/index')
const windowManager = require('electron-window-manager')

let menuShown = false
let view = null

app.commandLine.appendSwitch('--enable-transparent-visuals');
app.commandLine.appendSwitch('--enable-parallel-downloading');

function createWindow() {
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
            devTools: true,
            allowRunningInsecureContent: true,
            backgroundThrottling: true,
            webgl: true,
            autoplayPolicy: 'no-user-gesture-required'
        },
    })

    const electron = require('electron')
    const session = electron.session

    const filter = {
        urls: ["http://*/*", "https://*/*"]
    }
    session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details,callback)=> {
        details.requestHeaders['DNT'] = "1";
        callback({cancel: false, requestHeaders: details.requestHeaders})
    })

    app.setAsDefaultProtocolClient('webby')

    win.loadFile('index/index.html')

    win.setMenu(null)

    win.webContents.on('did-finish-load', async ()=>{
        win.show()
    })

    ipcMain.on('webtitlechange', (event, args) => {
        win.focus()
        win.title = "webby - " + args.toString()
    })

    ipcMain.on('webview:load', (event, args) => {
        BrowserView.fromId(args).webContents.on('new-window', (event, url)=>{
            event.preventDefault()
            BrowserWindow.getFocusedWindow().webContents.send('new-tab', url)
        })
    })

    ipcMain.on('home', (event, args)=>{
        closeMenu()
        BrowserWindow.getFocusedWindow().webContents.send('home')
    })

    globalShortcut.register("CommandOrControl+Shift+I", ()=>{
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

function closeMenu() {
    try {
        view.close()
        view.destroy()
        view = null
        menuShown = false
        window.focus();
    } catch {}
}

ipcMain.on('togglemax', ()=>{
    const currentwin = BrowserWindow.getFocusedWindow()
    if (currentwin.isMaximized()) {
        currentwin.unmaximize()
    } else {
        currentwin.maximize()
    }
})

ipcMain.on('contextmenu', (event, args)=>{
    const currentwin = BrowserWindow.getFocusedWindow()
    let menu = new Menu()

    menu.append(new MenuItem({
        label: "Back",
        click: function() {
            currentwin.webContents.send('back')
        },
        accelerator: 'Alt+Left'
    }))

    menu.append(new MenuItem({
        label: "Forward",
        click: function() {
            currentwin.webContents.send('forward')
        },
        accelerator: 'Alt+Right'
    }))

    menu.append(new MenuItem({
        label: "Reload",
        click: function() {
            currentwin.webContents.send('reloadpage')
        },
        accelerator: "CommandOrControl+R"
    }))

    menu.append(new MenuItem({
        type: 'separator'
    }))

    menu.append(new MenuItem({
        label: "Save as...",
        click: function() {
            currentwin.webContents.send('savepage')
        },
        accelerator: "CommandOrControl+S"
    }))

    menu.append(new MenuItem({
        label: "Print...",
        click: function() {
            currentwin.webContents.send('print')
        },
        accelerator: "CommandOrControl+P"
    }))

    menu.append(new MenuItem({
        type: 'separator'
    }))

    menu.append(new MenuItem({
        label: "Inspect Element",
        click: function() {
            currentwin.webContents.send('inspect-eli-cu', args)
        },
        accelerator: "CommandOrControl+Alt+Shift+I"
    }))

    menu.popup({window: currentwin})

    menu.once('menu-will-close', ()=>{
        menu = null
    })
})

ipcMain.on('textcontextmenu', (event, args)=>{
    const currentwin = BrowserWindow.getFocusedWindow()
    let menu = new Menu()

    if (process.platform === 'win32') {
        menu.append(new MenuItem({
            label: "Emoji",
            sublabel: "Win+Period",
            acceleratorWorksWhenHidden: true,
            click: function() {
                app.showEmojiPanel()
            }
        }))
    }

    menu.append(new MenuItem({
        type: 'separator'
    }))

    menu.append(new MenuItem({
        label: "Undo",
        accelerator: 'CommandOrControl+Z',
        click: function() {
            currentwin.webContents.send('undo')
        }
    }))

    menu.append(new MenuItem({
        label: "Redo",
        accelerator: 'CommandOrControl+Shift+Z',
        click: function () {
            currentwin.webContents.send('redo')
        }
    }))

    menu.append(new MenuItem({
        type: 'separator'
    }))

    menu.append(new MenuItem({
        label: "Cut",
        accelerator: 'CommandOrControl+X',
        click: function () {
            currentwin.webContents.send('cut')
        }
    }))

    menu.append(new MenuItem({
        label: "Copy",
        accelerator: 'CommandOrControl+C',
        click: function () {
            currentwin.webContents.send('copy')
        }
    }))

    menu.append(new MenuItem({
        label: "Paste",
        accelerator: 'CommandOrControl+V',
        click: function () {
            currentwin.webContents.send('paste')
        }
    }))

    menu.append(new MenuItem({
        label: "Select All",
        accelerator: 'CommandOrControl+A',
        click: function () {
            currentwin.webContents.send('selectall')
        }
    }))

    menu.append(new MenuItem({
        type: 'separator'
    }))

    menu.append(new MenuItem({
        label: "Inspect Element",
        accelerator: 'CommandOrControl+Alt+Shift+I',
        click: function () {
            currentwin.webContents.send('inspect-eli-cu', args)
        }
    }))

    menu.popup({
        window: currentwin
    })

    menu.once('menu-will-close', ()=>{
        menu = null
    })
})

ipcMain.on('imagecontextmenu', (event, args)=>{
    const currentwin = BrowserWindow.getFocusedWindow()
    let menu = new Menu()

    menu.append(new MenuItem({
        label: "Open image in new tab",
        click: function () {
            currentwin.webContents.send('open-img-newtab', args[2])
        }
    }))

    menu.append(new MenuItem({
        label: "Save image as...",
        click: function () {
            currentwin.webContents.send('saveimg', [args[2]])
        }
    }))

    menu.append(new MenuItem({
        label: "Copy image",
        click: function () {
            currentwin.webContents.send('copyimg')
        }
    }))

    menu.append(new MenuItem({
        label: "Copy image URL",
        click: function () {
            currentwin.webContents.send('copyimg-url')
        }
    }))

    menu.append(new MenuItem({
        type: 'separator'
    }))

    menu.append(new MenuItem({
        label: "Inspect Element",
        accelerator: 'CommandOrControl+Alt+Shift+I',
        click: function () {
            currentwin.webContents.send('inspect-eli-cu', args)
        }
    }))

    menu.popup({
        window: currentwin
    })

    menu.once('menu-will-close', ()=>{
        menu = null
    })
})

ipcMain.on('minimize', ()=>{
    BrowserWindow.getFocusedWindow().minimize()
})

ipcMain.on('close', ()=>{
    try {
        BrowserWindow.getFocusedWindow().close()
    } catch {}
})

ipcMain.on('menu:open', async ()=>{
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

    view.webContents.on('dom-ready', async ()=>{
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

    view.addListener('blur', ()=>{
        closeMenu()
    })
})

ipcMain.on('newtab', async ()=>{
    closeMenu()
    BrowserWindow.getFocusedWindow().webContents.send('new-tab', 'webby://newtab')
})

ipcMain.on('newwin', ()=>{
    shell.openPath(app.getPath('exe')).then()
})

ipcMain.on('closetab', (event, args) => {
    const currentwin = BrowserWindow.getFocusedWindow()
    try {
        currentwin.removeBrowserView(BrowserView.fromId(args[0]))
        currentwin.addBrowserView(BrowserView.fromId(args[1]))
    } catch {}
})

ipcMain.on('quit', (event, args)=>{
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

ipcMain.on('about', (event, args)=>{
    closeMenu()
    app.setAboutPanelOptions({
        applicationName: "webby",
        applicationVersion: '1.0',
        authors: "Lockie Luke",
    })
    app.showAboutPanel()
})

ipcMain.on('reloadpage', (event, args)=>{
    closeMenu()
    BrowserWindow.getFocusedWindow().webContents.send('reloadpage', args)
})

function closeAllWindows() {
    for (let i = 0; i < BrowserWindow.getAllWindows().length; i++) {
        BrowserWindow.getAllWindows()[i].close()
    }
}

app.whenReady().then(createWindow)

app.whenReady().then(()=>{
    registerProtocols()
})

app.on('ready', ()=>{
    windowManager.init()
})

app.on('window-all-closed', ()=>{
    if (process.platform !== 'darwin') {
        closeMenu()
        closeAllWindows()
        app.quit()
        process.abort()
        app.exit(0)
    }
})

app.on('will-quit', ()=>{
    closeMenu()
    closeAllWindows()
    app.quit()
    process.abort()
    app.exit(0)
})

app.on('activate', ()=>{
    if (BrowserWindow.getAllWindows().length === 0)
        shell.openPath(app.getPath('exe'))
})
