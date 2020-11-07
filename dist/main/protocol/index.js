"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
function main(window) {
    electron_1.protocol.registerFileProtocol('zinc', function (request, callback) {
        let finalURL;
        switch (request.url.replace('zinc://', '')) {
            case 'newtab':
                window.loadURL('https://www.google.com');
                break;
            default:
                break;
        }
    });
}
exports.default = main;
//# sourceMappingURL=index.js.map