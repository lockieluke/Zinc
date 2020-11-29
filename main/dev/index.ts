import {registerLocalKeyStroke} from "../keystrokes";

export default function main(window: Electron.BrowserWindow) {
    registerLocalKeyStroke("CommandOrControl+Shift+R", window, function () {
        window.reload();
    })
}