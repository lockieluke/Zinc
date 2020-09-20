import * as Store from "electron-store";
const store: Store = new Store()

export function saveSitePerm(url: string, allowed: boolean) {
    let permlength: number = 0
    if (!store.has('perm-length')) {
        store.set('perm-length', permlength)
        permlength = parseInt(String(store.get('perm-length')))
    } else {
        permlength = parseInt(String(store.get('perm-length')))
    }

    store.set('perm-site-' + permlength, url)
    store.set('perm-allowed-' + permlength, String(allowed))
    permlength++
}

export function clearPerm() {
    for (let i = 0; i < getPermLengthAsInt(); i++) {
        store.delete('perm-site-' + i)
        store.delete('perm-allowed-' + i)
    }
    store.delete('perm-length')
}

export function getAllowed(url: string) {
    let index: number = 0
    let allowed: boolean = false
    for (let i = 0; i < getPermLengthAsInt(); i++) {
        if (store.get('perm-site-' + i) == url) {
            index = i
            allowed = Boolean(store.get('perm-allowed-' + i))
            break
        }
    }
    return allowed
}

function getPermLengthAsInt() {
    return parseInt(String(store.get('perm-length')))
}