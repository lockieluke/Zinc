"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tabMng_1 = require("./browser/tabMng");
const controls_1 = require("./browser/controls");
const protocol_1 = require("./protocol");
const winCtrls_1 = require("./browser/winCtrls");
const titleManager_1 = require("./browser/titleManager");
const backForwardManager_1 = require("./browser/backForwardManager");
window.onload = function () {
    winCtrls_1.default();
    titleManager_1.default();
    backForwardManager_1.default();
    controls_1.newTabBtn.addEventListener('click', function () {
        tabMng_1.TabMng.newTab(protocol_1.default('zinc://newtab'));
    });
    controls_1.closeTabBtn.addEventListener('click', function () {
        if (!tabMng_1.TabMng.closeLocked) {
            tabMng_1.TabMng.closeTab();
        }
    });
    tabMng_1.TabMng.newTab(protocol_1.default('zinc://newtab'));
};
//# sourceMappingURL=window.js.map