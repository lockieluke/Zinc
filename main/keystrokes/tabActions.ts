import electronLocalKeystroke from "./index";
import TabWrapper from "../browser/tabWrapper";
import zincProtocolHandler from './../../window/protocol'

export default function registerTabActionsKeystrokes(window: Electron.BrowserWindow) {
    electronLocalKeystroke.registerLocalKeyStroke('CommandOrControl+Shift+Alt+I', window, function () {
        window.webContents.openDevTools({
            mode: 'undocked'
        });
    })

    electronLocalKeystroke.registerLocalKeyStroke('CommandOrControl+T', window, function () {
        TabWrapper.newTab(zincProtocolHandler('zinc://newtab'));
    })

    electronLocalKeystroke.registerLocalKeyStroke('CommandOrControl+W', window, function () {
        TabWrapper.closeTab();
    })
}