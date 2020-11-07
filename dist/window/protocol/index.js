"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
function main(url) {
    const rawURL = url.replace('zinc://', '');
    switch (rawURL) {
        case 'newtab':
            return 'file:///' + path.join(__dirname, '..', '..', '..', 'pages', 'newtab', 'index.html');
        default:
            break;
    }
}
exports.default = main;
//# sourceMappingURL=index.js.map