import { globalShortcut, BrowserWindow } from "electron";
import { registerDevToolShortcuts } from './devtools'

BrowserWindow.getAllWindows()[0].on('focus', ()=>{
    globalShortcut.unregisterAll()
    registerDevToolShortcuts()
})
