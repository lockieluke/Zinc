"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
<<<<<<< HEAD
from;
"./devtools";
//# sourceMappingURL=index.js.map
=======
exports.registerAllShortcuts = void 0;
const devtools_1 = require("./devtools");
require('./deregister');
require('./register');
devtools_1.registerDevToolShortcuts();
function registerAllShortcuts() {
    devtools_1.registerDevToolShortcuts();
}
exports.registerAllShortcuts = registerAllShortcuts;
>>>>>>> f7b8da82bcbb3dfe071e61cb851f780ab4fd15d0
