import { globalShortcut, BrowserWindow, ipcMain } from "electron";

export function registerDevToolShortcuts() {
    globalShortcut.register('CommandOrControl+Shift+I', ()=>{
        BrowserWindow.getFocusedWindow().webContents.openDevTools({
            mode: 'detach'
        })
    })
    
    globalShortcut.register('CommandOrControl+Alt+Shift+I', ()=>{
        BrowserWindow.getFocusedWindow().webContents.send('webview-devtools')
    })
}