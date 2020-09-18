const {Menu, MenuItem, BrowserWindow} = require('electron')
let view

function openMenu() {
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
}

function closeMenu() {
    try {
        view.close()
        view.destroy()
        view = null
        menuShown = false
        window.focus();
    } catch { }
}

module.exports = {closeMenu, openMenu}