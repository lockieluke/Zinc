"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAllShortcuts = void 0;
const devtools_1 = require("./devtools");
require('./deregister');
require('./register');
devtools_1.registerDevToolShortcuts();
function registerAllShortcuts() {
    devtools_1.registerDevToolShortcuts();
}
exports.registerAllShortcuts = registerAllShortcuts;
//# sourceMappingURL=index.js.map