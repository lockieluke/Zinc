"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerLocalKeyStroke = void 0;
const electron_1 = require("electron");
function main(window) {
    register();
    window.on('focus', function () {
        register();
    });
    window.on('blur', function () {
        electron_1.globalShortcut.unregisterAll();
    });
    function register() {
        electron_1.globalShortcut.register('CommandOrControl+Alt+Shift+I', function () {
            window.webContents.openDevTools({
                mode: 'undocked'
            });
        });
    }
}
exports.default = main;
function registerLocalKeyStroke(keystroke, window, callback) {
    electron_1.globalShortcut.register(keystroke, function () {
        callback();
    });
    window.on('focus', function () {
        electron_1.globalShortcut.register(keystroke, function () {
            callback();
        });
    });
    window.on('blur', function () {
        electron_1.globalShortcut.unregisterAll();
    });
}
exports.registerLocalKeyStroke = registerLocalKeyStroke;
//# sourceMappingURL=index.js.map