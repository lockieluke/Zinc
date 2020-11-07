import {BrowserWindow, globalShortcut} from 'electron'

export default function main(window: BrowserWindow) {
    register();
    window.on('focus', function () {
        register();
    })

    window.on('blur', function () {
        globalShortcut.unregisterAll();
    })

    function register() {
        globalShortcut.register('CommandOrControl+Alt+Shift+I', function () {
            window.webContents.openDevTools({
                mode: 'undocked'
            })
        });
    }
}

export function registerLocalKeyStroke(keystroke: string, window: BrowserWindow, callback: Function) {
    globalShortcut.register(keystroke, function () {
        callback();
    });

    window.on('focus', function () {
        globalShortcut.register(keystroke, function () {
            callback();
        });
    })

    window.on('blur', function () {
        globalShortcut.unregisterAll();
    })
}