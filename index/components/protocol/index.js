const {protocol, dialog, BrowserWindow} = require('electron')
const path = require('path')
const fs = require('fs')

module.exports = {
    registerProtocols
}

protocol.registerSchemesAsPrivileged([
    {
        scheme: 'webby',
        privileges: {
            bypassCSP: true,
            secure: false,
            standard: true,
            supportFetchAPI: true,
            allowServiceWorkers: true,
            corsEnabled: false,
        },
    },
]);

// content security policies
const contentSecurityPolicies = 'default-src *  data: blob: filesystem: about: ws: wss: \'unsafe-inline\' \'unsafe-eval\' \'unsafe-dynamic\'; \n' +
    'script-src * data: blob: \'unsafe-inline\' \'unsafe-eval\'; \n' +
    'connect-src * data: blob: \'unsafe-inline\'; \n' +
    'img-src * data: blob: \'unsafe-inline\'; \n' +
    'frame-src * data: blob: ; \n' +
    'style-src * data: blob: \'unsafe-inline\';\n' +
    'font-src * data: blob: \'unsafe-inline\';'

const webby_DESKTOP_CSP = `
  default-src *; script-src *; connect-src *; img-src *; style-src *;base-uri *;form-action *
`.replace(/\n/g, '')

function registerProtocols() {
    protocol.registerFileProtocol('webby', async (request, callback)=>{
        callback({
            path: path.join(__dirname, '..', '..', '..', 'newtab', 'index.html')
        })
    })
}