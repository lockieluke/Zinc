const {BrowserWindow, Menu, MenuItem, app, clipboard} = require('electron')

function textContextMenu (args) {
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
}

function imageContextMenu(args) {
    const currentwin = BrowserWindow.getFocusedWindow()
    let menu = new Menu()

    menu.append(new MenuItem({
        label: "Open image in new tab",
        click: function () {
            currentwin.webContents.send('open-newtab', args[2])
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
            clipboard.writeText(args[2])
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
}

function defContextMenu(args) {
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
}

function anchorContextMenu(args) {
    const currentwin = BrowserWindow.getFocusedWindow()
    let menu = new Menu()

    menu.append(new MenuItem({
        label: "Open link in new tab",
        sublabel: "Control+Click",
        accelerator: '',
        click: function() {
            currentwin.webContents.send('open-newtab', args[2])
        }
    }))

    menu.append(new MenuItem({
        type: 'separator'
    }))

    menu.append(new MenuItem({
        label: "Copy link",
        click: function () {
            clipboard.writeText(args[2])
        }
    }))

    menu.append(new MenuItem({
        type: 'separator'
    }))

    menu.append(new MenuItem({
        label: "Inspect Element",
        click: function () {
            currentwin.webContents.send('inspect-eli-cu', args)
        }
    }))

    menu.popup({window: currentwin})

    menu.once('menu-will-close', ()=>{
        menu = null
    })
}

module.exports = {textContextMenu, imageContextMenu, defContextMenu, anchorContextMenu}