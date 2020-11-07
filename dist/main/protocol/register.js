"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
function main() {
    electron_1.protocol.registerHttpProtocol('zinc', function (request, callback) {
        callback({
            url: "https://www.google.com"
        });
    });
}
exports.default = main;
//# sourceMappingURL=register.js.map