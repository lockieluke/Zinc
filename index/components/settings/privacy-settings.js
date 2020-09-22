"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearSitePerms = exports.getSitePerm = exports.saveSitePerm = void 0;
const Store = require("electron-store");
const privacy_types_1 = require("./privacy-types");
const store = new Store();
function saveSitePerm(_url, allowed, permission) {
    let url = new URL(_url);
    store.set('perm-site-' + url.hostname + '-' + getPermTypeAsString(permission), String(allowed));
}
exports.saveSitePerm = saveSitePerm;
function getSitePerm(_url, permission) {
    let url = new URL(_url);
    let allowed = false;
    if (store.has('perm-site-' + url.hostname + '-' + getPermTypeAsString(permission))) {
        allowed = Boolean(store.get('perm-site-' + url.hostname + '-' + getPermTypeAsString(permission)));
    }
    else {
        throw new Error("Trying to access settings that have not been set");
    }
    if (store.has('perm-sites')) {
        let urls = String(store.get('perm-sites'));
        urls += url.hostname + ';';
        store.set('perm-sites', urls);
    }
    else {
        store.set('perm-sites', url.hostname + ';');
    }
}
exports.getSitePerm = getSitePerm;
function clearSitePerms() {
    if (!store.has('perm-sites'))
        throw new Error('Trying to access settings that have not been set');
    const urls = String(store.get('perm-sites')).split(';');
    for (let i = 0; i < urls.length; i++) {
        const basekey = 'perm-site-' + urls[i] + '-';
        try {
            store.delete(basekey + 'media');
        }
        catch {
        }
        try {
            store.delete(basekey + 'mediakeysys');
        }
        catch {
        }
        try {
            store.delete(basekey + 'location');
        }
        catch {
        }
        try {
            store.delete(basekey + 'midi');
        }
        catch {
        }
        try {
            store.delete(basekey + 'midisyex');
        }
        catch {
        }
        try {
            store.delete(basekey + 'pointerlock');
        }
        catch {
        }
        try {
            store.delete(basekey + 'fullscreen');
        }
        catch {
        }
        try {
            store.delete(basekey + 'openexternal');
        }
        catch {
        }
    }
}
exports.clearSitePerms = clearSitePerms;
function getPermTypeAsString(permission) {
    switch (permission) {
        case privacy_types_1.Permissions.Media:
            return 'media';
        case privacy_types_1.Permissions.MediaKeySystem:
            return 'mediakeysys';
        case privacy_types_1.Permissions.Location:
            return 'location';
        case privacy_types_1.Permissions.Notification:
            return 'notification';
        case privacy_types_1.Permissions.Midi:
            return 'midi';
        case privacy_types_1.Permissions.MidiSyex:
            return 'midisyex';
        case privacy_types_1.Permissions.PointerLock:
            return 'pointerlock';
        case privacy_types_1.Permissions.FullScreen:
            return 'fullscreen';
        case privacy_types_1.Permissions.OpenExternal:
            return 'openexternal';
        default:
            throw new Error('Invalid Permission Type');
    }
}
//# sourceMappingURL=privacy-settings.js.map