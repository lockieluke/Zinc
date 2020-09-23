const {ipcMain, BrowserWindow} = require('electron')

ipcMain.on('apps', ()=>{
    BrowserWindow.getAllWindows()[0].webContents.send('apps')
})