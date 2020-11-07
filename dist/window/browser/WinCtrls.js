"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const controls_1 = require("./controls");
function main() {
    controls_1.winCloseBtn.addEventListener('click', function () {
        electron_1.ipcRenderer.send('win-close');
    });
    controls_1.winMaxBtn.addEventListener('click', function () {
        electron_1.ipcRenderer.send('win-max');
    });
    controls_1.winMinBtn.addEventListener('click', function () {
        electron_1.ipcRenderer.send('win-min');
    });
}
exports.default = main;
//# sourceMappingURL=winCtrls.js.map