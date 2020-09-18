const { textContextMenu, imageContextMenu, defContextMenu, anchorContextMenu } = require('./../ctxmenu/index')
const {ipcMain} = require('electron')

ipcMain.on('contextmenu', async (_event, args) => {
    defContextMenu(args)
})

ipcMain.on('textcontextmenu', async (_event, args) => {
    textContextMenu(args)
})

ipcMain.on('imagecontextmenu', async (_event, args) => {
    imageContextMenu(args)
})

ipcMain.on('anchorcontextmenu', async (_event, args) => {
    anchorContextMenu(args)
})