"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
function main() {
    electron_1.ipcMain.on('logger-print-main', function (event, args) {
        console.log(args);
    });
}
exports.default = main;
//# sourceMappingURL=index.js.map