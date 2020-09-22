import { globalShortcut, BrowserWindow } from "electron";
import { registerDevToolShortcuts } from './devtools'

BrowserWindow.getFocusedWindow().on('focus', ()=>{
    globalShortcut.unregisterAll()
    registerDevToolShortcuts()
})