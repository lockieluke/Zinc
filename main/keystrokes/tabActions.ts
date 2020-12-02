import electronLocalKeystroke from "./index";

export default function registerTabActionsKeystrokes(window: Electron.BrowserWindow) {
    electronLocalKeystroke.registerLocalKeyStroke('CommandOrControl+Shift+Alt+I', window, function () {
        window.webContents.openDevTools({
            mode: 'undocked'
        });
    })
}