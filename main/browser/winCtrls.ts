import {app, BrowserWindow, ipcMain} from 'electron'

export default function main() {
    const currentwin: BrowserWindow = BrowserWindow.getFocusedWindow();

    ipcMain.on('win-close', function () {
        currentwin.close();
        if (BrowserWindow.getAllWindows().length == 0 && process.platform !== 'darwin')
            app.quit();
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
}