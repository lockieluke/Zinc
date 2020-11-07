import {BrowserWindow, ipcMain} from 'electron'

const currentwin: BrowserWindow = BrowserWindow.getFocusedWindow();

ipcMain.on('win-close', function () {
    currentwin.close();
})

ipcMain.on('win-max', function () {
    if (currentwin.isMaximized()) {
        currentwin.unmaximize();
    } else {
        currentwin.maximize();
    }
})

ipcMain.on('win-min', function () {
    currentwin.minimize();
})