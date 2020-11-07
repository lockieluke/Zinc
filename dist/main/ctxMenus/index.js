"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
function main(window) {
    let menu = new electron_1.Menu();
    menu.append(new electron_1.MenuItem({
        label: "HELLO"
    }));
    electron_1.ipcMain.on('ctxmenu', function () {
        menu.popup({
            window: window
        });
    });
}
exports.default = main;
//# sourceMappingURL=index.js.map