import { BrowserWindow, globalShortcut } from "electron";

BrowserWindow.getFocusedWindow().on('blur', ()=>{
    globalShortcut.unregisterAll()
})