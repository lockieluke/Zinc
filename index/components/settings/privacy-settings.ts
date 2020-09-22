import * as Store from "electron-store";
import { Permissions } from "./privacy-types";
const store: Store = new Store()

export function saveSitePerm(_url: string, allowed: boolean, permission: Permissions) {
    let url: URL = new URL(_url)
    store.set('perm-site-' + url.hostname + '-' + getPermTypeAsString(permission), String(allowed))
}

export function getSitePerm(_url: string, permission: Permissions) {
    let url: URL = new URL(_url)
    let allowed: boolean = false
    
    if (store.has('perm-site-' + url.hostname + '-' + getPermTypeAsString(permission))) {
        allowed = Boolean(store.get('perm-site-' + url.hostname + '-' + getPermTypeAsString(permission)))
    } else {
        throw new Error("Trying to access settings that have not been set")
    }

    if (store.has('perm-sites')) {
        let urls: string = String(store.get('perm-sites'))
        urls += url.hostname + ';'
        store.set('perm-sites', urls)
    } else {
        store.set('perm-sites', url.hostname + ';')
    }
}

export function clearSitePerms() {
    if (!store.has('perm-sites')) throw new Error('Trying to access settings that have not been set')
    const urls: string[] = String(store.get('perm-sites')).split(';')
    for (let i = 0; i < urls.length; i++) {
        const basekey: string = 'perm-site-' + urls[i] + '-'
        try {
            store.delete(basekey + 'media')
        } catch {

        }
        try {
            store.delete(basekey + 'mediakeysys')
        } catch {
            
        }
        try {
            store.delete(basekey + 'location')
        } catch {

        }
        try {
            store.delete(basekey + 'midi')
        } catch {

        }
        try {
            store.delete(basekey + 'midisyex')
        } catch {

        }
        try {
            store.delete(basekey + 'pointerlock')
        } catch {

        }
        try {
            store.delete(basekey + 'fullscreen')
        } catch {

        }
        try {
            store.delete(basekey + 'openexternal')
        } catch {
            
        }
    }
}

function getPermTypeAsString(permission: Permissions) {
    switch (permission) {
        case Permissions.Media:
            return 'media'

        case Permissions.MediaKeySystem:
            return 'mediakeysys'

        case Permissions.Location:
            return 'location'

        case Permissions.Notification:
            return 'notification'

        case Permissions.Midi:
            return 'midi'

        case Permissions.MidiSyex:
            return 'midisyex'

        case Permissions.PointerLock:
            return 'pointerlock'

        case Permissions.FullScreen:
            return 'fullscreen'

        case Permissions.OpenExternal:
            return 'openexternal'
    
        default:
            throw new Error('Invalid Permission Type')
    }
}