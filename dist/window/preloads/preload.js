"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
window.onload = function () {
    document.addEventListener('mousedown', function (event) {
        if (event.button == 2)
            electron_1.ipcRenderer.send('ctxmenu');
    });
};
//# sourceMappingURL=preload.js.map