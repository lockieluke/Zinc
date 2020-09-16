const {BrowserWindow, Menu, MenuItem, app} = require('electron')

function textContextMenu () {
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

function imageContextMenu() {
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
}

module.exports = {textContextMenu, imageContextMenu}