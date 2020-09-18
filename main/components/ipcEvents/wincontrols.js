const {ipcMain, BrowserWindow} = require('electron')

ipcMain.on('minimize', () => {
    BrowserWindow.getFocusedWindow().minimize()
})

ipcMain.on('close', () => {
    BrowserWindow.getFocusedWindow().close()
})

ipcMain.on('togglemax', () => {
    const currentwin = BrowserWindow.getFocusedWindow()
    if (currentwin.isMaximized()) {
        currentwin.unmaximize()
    } else {
        currentwin.maximize()
    }
})