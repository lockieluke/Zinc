import { BrowserWindow, globalShortcut } from "electron";

BrowserWindow.getAllWindows()[0].on('blur', () => {
    globalShortcut.unregisterAll()
})
