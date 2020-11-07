"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
function main() {
    electron_1.ipcRenderer.on('tabmng-browser-titleupdated', function (event, args) {
        document.getElementById(args[0].replace('tab', 'tabtitle')).innerText = args[1];
    });
}
exports.default = main;
//# sourceMappingURL=titleManager.js.map