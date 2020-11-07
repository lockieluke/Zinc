"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const controls_1 = require("./controls");
function main() {
    electron_1.ipcRenderer.on('tabmng-browser-did-finish-load', function (event, args) {
        const backBtnHTML = '<span>&leftarrow;</span>';
        const forwardBtnHTML = '<span>&rightarrow;</span>';
        try {
            document.getElementById('backBtn').remove();
        }
        catch { }
        try {
            document.getElementById('forwardBtn').remove();
        }
        catch { }
        const backbtn = document.createElement('div');
        backbtn.id = 'backBtn';
        backbtn.className = 'titlebarbtns';
        backbtn.title = 'Back';
        backbtn.innerHTML = backBtnHTML;
        const forwardbtn = document.createElement('div');
        forwardbtn.id = 'forwardBtn';
        forwardbtn.className = 'titlebarbtns';
        forwardbtn.title = 'Forward';
        forwardbtn.innerHTML = forwardBtnHTML;
        if (args[0]) {
            controls_1.titleBarCtrls.appendChild(backbtn);
        }
        if (args[1]) {
            controls_1.titleBarCtrls.appendChild(forwardbtn);
        }
        backbtn.addEventListener('click', function () {
            electron_1.ipcRenderer.send('tabmng-back');
        });
        forwardbtn.addEventListener('click', function () {
            electron_1.ipcRenderer.send('tabmng-forward');
        });
    });
}
exports.default = main;
//# sourceMappingURL=backForwardManager.js.map