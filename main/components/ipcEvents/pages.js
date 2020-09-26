const {ipcMain, BrowserWindow} = require('electron')
const {closeMenu} = require('../menu')

ipcMain.on('apps', ()=>{
    closeMenu()
    BrowserWindow.getAllWindows()[0].webContents.send('apps')
})