import { registerDevToolShortcuts } from "./devtools";
require('./deregister')
require('./register')

registerDevToolShortcuts()

export function registerAllShortcuts() {
    registerDevToolShortcuts()
}