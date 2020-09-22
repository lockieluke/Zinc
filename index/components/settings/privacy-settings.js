"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllowed = exports.clearPerm = exports.saveSitePerm = void 0;
const Store = require("electron-store");
const store = new Store();
function saveSitePerm(url, allowed) {
    let permlength = 0;
    if (!store.has('perm-length')) {
        store.set('perm-length', permlength);
        permlength = parseInt(String(store.get('perm-length')));
    }
    else {
        permlength = parseInt(String(store.get('perm-length')));
    }
    store.set('perm-site-' + permlength, url);
    store.set('perm-allowed-' + permlength, String(allowed));
    permlength++;
}
exports.saveSitePerm = saveSitePerm;
function clearPerm() {
    for (let i = 0; i < getPermLengthAsInt(); i++) {
        store.delete('perm-site-' + i);
        store.delete('perm-allowed-' + i);
    }
    store.delete('perm-length');
}
exports.clearPerm = clearPerm;
function getAllowed(url) {
    let index = 0;
    let allowed = false;
    for (let i = 0; i < getPermLengthAsInt(); i++) {
        if (store.get('perm-site-' + i) == url) {
            index = i;
            allowed = Boolean(store.get('perm-allowed-' + i));
            break;
        }
    }
    return allowed;
}
exports.getAllowed = getAllowed;
function getPermLengthAsInt() {
    return parseInt(String(store.get('perm-length')));
}
//# sourceMappingURL=privacy-settings.js.map