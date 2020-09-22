const { settings } = require("cluster");
const electron = require("electron");
const { remote, ipcRenderer } = electron;
const isDev = require('electron-is-dev');
const PrivacySettings = require('./components/settings/privacy-settings');
const fs = require('fs')
require('./components/wincontrols/index');

ipcRenderer.on('navi-history', async () => {
    newTabOperation('zinc://history');
});
ipcRenderer.on('new-tab', async (_event, args) => {
    newTabOperation(args)
    // addEventListenerToTabs()
})
ipcRenderer.on('reloadpage', async (_event, args) => {
    reloadWebView(tabprocessesindentifier['tab-' + focusedtab], args);
});
ipcRenderer.on('home', async (_event, _args) => {
    navigateTO("zinc://newtab");
});
ipcRenderer.on('back', goBack);
ipcRenderer.on('forward', goForward);
ipcRenderer.on('savepage', savePage);
ipcRenderer.on('print', printPage);
ipcRenderer.on('undo', async () => {
    const BrowserView = remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.executeJavaScript('document.execCommand("undo")')
})
ipcRenderer.on('redo', async () => {
    const BrowserView = remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.executeJavaScript('document.execCommand("redo")')
})
ipcRenderer.on('cut', async () => {
    const BrowserView = remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.cut()
})
ipcRenderer.on('copy', async () => {
    const BrowserView = remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.copy()
})
ipcRenderer.on('paste', async () => {
    const BrowserView = remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.paste()
})
ipcRenderer.on('selectall', async () => {
    const BrowserView = remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.selectAll()
})
ipcRenderer.on('inspect-eli-cu', async (_event, args) => {
    const BrowserView = remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.inspectElement(args[0], args[1])
})
ipcRenderer.on('open-newtab', async (_event, args) => {
    const BrowserView = remote.BrowserView
    const { validURL } = require('../universal/utils/urls/index')
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    if (validURL(args)) {
        newTabOperation(args)
    } else {
        newTabOperation(currentview.webContents.getURL() + args)
    }
    newTabOperation((validURL(args) ? '' : currentview.webContents.getURL()) + args)
})
ipcRenderer.on('saveimg', async (_event, args) => {
    const dialog = remote.dialog
    const win = remote.getCurrentWindow()
    const saveDialog = dialog.showSaveDialogSync(win, {
        title: "Zinc - Save Image As",
        buttonLabel: "Save",
        defaultPath: '~/' + args[0]
    })
    const url = args[0];

    if (saveDialog) {
        console.log("Saving image from " + url)
        // remove Base64 stuff from the Image
        toDataURL(url).then(async dataURL => {
            fs.writeFile(saveDialog, Buffer.from(dataURL.replace(/^data:image\/\w+;base64,/, ""), 'base64'), err => {
                if (err) {
                    console.error(err.message)
                }
            })
        });
    }

    function toDataURL(url) {
        return new Promise((res, _rej) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    res(reader.result);
                }
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.send();
        });
    }
})

ipcRenderer.on('webview-devtools', () => {
    remote.BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]]).webContents.openDevTools({
        mode: 'right'
    })
})

let tabcount = 0
let tabprocessesindentifier = {

}
let taburls = {

}
let webviewids = {}
let closelocked
let tabcounter = 0
let focusedtab = 0


function init() {
    newTabOperation("zinc://newtab")
}

window.onload = async () => {
    sleep(0).then(init)
}

document.getElementById('newtab').addEventListener('click', () => {
    newTabOperation("zinc://newtab")
})

document.getElementById('closetab').addEventListener('click', () => {
    if (!closelocked) {
        closeFocusedTab()
    }
})

document.getElementById('backBtn').addEventListener('click', () => {
    goBack()
})

document.getElementById('forwardBtn').addEventListener('click', () => {
    goForward()
})

document.getElementById('menuBtn').addEventListener('click', async () => {
    ipcRenderer.send('menu:open')
})

async function goBack() {
    const BrowserView = remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.goBack()
}

async function goForward() {
    const BrowserView = remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.goForward()
}

async function savePage() {
    const BrowserView = remote.BrowserView;
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]]);
    const savePath = remote.dialog.showSaveDialogSync(remote.getCurrentWindow(), {
        buttonLabel: 'Save',
        title: "Save As",
        filters: [
            { extensions: ['html', 'htm'], name: 'Webpage, Complete' }
        ],
        defaultPath: '~/' + currentview.webContents.getTitle(),
        properties: ['dontAddToRecent']
    })
    currentview.webContents.savePage(savePath.toString(), 'HTMLComplete')
}

async function printPage() {
    const BrowserView = remote.BrowserView;
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]]);
    currentview.webContents.print({});
}

function getDomain(url) {
    let host = url;
    if (host.startsWith('http://') || host.startsWith('https://'))
        host = host.split('://')[1];

    if (url.includes('?'))
        host = host.split('?')[0];

    host = host.includes('://') ? `${host.split('://')[0]}://${host.split('/')[2]}` : host.split('/')[0];

    return host;
};

function newTabOperation(url) {
    let newtab = document.createElement('div');
    newtab.className = 'tab';
    newtab.id = 'tab-' + tabcount;
    let tabtitle = document.createElement('h6');
    tabtitle.innerText = "Loading";
    tabtitle.id = 'tabtitle-' + tabcounter;
    newtab.appendChild(tabtitle);
    document.getElementsByClassName('tabs').item(0).appendChild(newtab);
    console.log("Total Tab Count(start from 0): " + tabcount);
    tabprocessesindentifier[newtab.id] = tabcounter;
    focusedtab = parseInt(newtab.id.replace('tab-', ''));
    const BrowserView = remote.BrowserView
    const webview = new BrowserView({
        webPreferences: {
            nodeIntegration: url.startsWith('zinc://'),
            contextIsolation: !url.startsWith('zinc://'),
            enableRemoteModule: url.startsWith('zinc://'),
            preload: require('path').join(__dirname, 'preload.js'),
        }
    })
    webview.webContents.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36'
    const win = remote.getCurrentWindow()
    win.setBrowserView(webview)
    webviewids[tabcounter] = webview.id
    console.log("Changed WebView ID to " + webview.id)
    if (url.startsWith('zinc://')) {
        const { getURL } = require('./components/zinc-urls/index')
        webview.webContents.loadFile(getURL(url.replace('zinc://', '')))
    } else {
        webview.webContents.loadURL(url)
    }
    ipcRenderer.send('webview:load', webview.id)
    webview.setBackgroundColor('#ffffff')
    focusOntoTab(tabprocessesindentifier[newtab.id])
    webview.webContents.on('did-finish-load' || 'page-title-updated' || 'did-frame-finish-load', () => {
        const { storeHistory } = require('./components/history/index')
        renewTabTitle(webview.webContents.getTitle(), newtab.id, webview)
        storeHistory(webview.webContents.getTitle(), webview.webContents.getURL(), `${new Date().getHours()}:${new Date().getMinutes()}`, `${new Date().getFullYear()};${new Date().getMonth()};${new Date().getDate()}`)
    })
    webview.webContents.on('page-title-updated', () => {
        renewTabTitle(webview.webContents.getTitle(), newtab.id, webview)
    })
    webview.webContents.on('will-redirect', () => {
        renewTabTitle("Loading", newtab.id, webview)
    })
    // domain permissions
    const dialog = remote.dialog
    const site = getDomain(webContents.getURL());
    webview.webContents.session.setPermissionRequestHandler(async (_webContents, perm, callback, _details) => {
        let permdialog;
        if (!isDev) {
            permdialog = await dialog.showMessageBox(remote.getCurrentWindow(), {
                title: "Zinc - Permissions",
                message: `${site} would like to have ${perm} permission. Granting permissions to untrusted websites may lead to privacy / security issues.`,
                buttons: ["Deny", "Allow Anyway"],
                type: 'question'
            });
            PrivacySettings.saveSitePerm(site, permdialog, perm);
        }
        callback(permdialog);
    });
    addEventListenerToTabs()
    tabcount++
    tabcounter++
}

function renewTabTitle(title, tabid, webview) {
    document.getElementById('tabtitle-' + tabprocessesindentifier[tabid]).innerText = title
    updateBackForwardButton()
    if (tabid === 'tab-' + focusedtab) {
        ipcRenderer.send('webtitlechange', webview.webContents.getTitle())
    }
    taburls[tabprocessesindentifier[newtab.id]] = webview.webContents.getURL()
    document.getElementById(tabid).title = webview.webContents.getTitle()
}

function resizeWebview() {
    const currentwebview = remote.BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    switch (remote.getCurrentWindow().isMaximized()) {
        case true:
            currentwebview.setBounds({
                height: remote.getCurrentWindow().getBounds().height - 80,
                width: remote.getCurrentWindow().getBounds().width - 15,
                y: 65,
                x: 0
            })
            break

        case false:
            currentwebview.setBounds({
                height: remote.getCurrentWindow().getBounds().height - 65,
                width: remote.getCurrentWindow().getBounds().width,
                y: 65,
                x: 0
            })
            break
    }
}

function closeFocusedTab() {
    if (tabcount > 1) {
        var eTabs = document.getElementById('tabs');
        closelocked = true
        let closingtabdom = document.getElementById('tab-' + focusedtab)
        closingtabdom.style.animation = 'close-tab 0.3s forwards ease-out'
        closingtabdom.addEventListener('animationend', async () => {
            let olduniqueid = tabprocessesindentifier['tab-' + focusedtab]
            delete tabprocessesindentifier['tab-' + focusedtab]
            closingtabdom.remove()
            console.log("Reordering tab children")
            for (let i = 0; i < eTabs.children.length; i++) {
                eTabs.children.item(i).id = 'tab-' + i
            };
            let temptabpro = {}
            for (let i = 0; i < Object.keys(tabprocessesindentifier).length; i++) {
                temptabpro['tab-' + i] = tabprocessesindentifier[Object.keys(tabprocessesindentifier)[i]]
            }
            tabprocessesindentifier = temptabpro
            releaseWebView(olduniqueid)

            let eLTab = document.getElementById('tab-' + (focusedtab - 1))
            if (eLTab) {
                eLTab.click()
            } else {
                closingtabdom.click()
            }

            closelocked = false
        })
        tabcount -= 1
    } else {
        remote.getCurrentWindow().close()
    }
}

function addEventListenerToTabs() {
    for (let i = 0; i < tabcount; i++) {
        const currenthandlingtab = document.getElementById('tab-' + i)
        currenthandlingtab.addEventListener('click', (_event) => {
            focusOntoTab(tabprocessesindentifier[currenthandlingtab.id])
            resizeWebview()
        })
    }
    console.log('Updated event listeners')
}

function focusOntoTab(uniqueid) {
    const BrowserView = require('electron').remote.BrowserView
    const switchingview = BrowserView.fromId(webviewids[uniqueid])
    console.log("Switching to tab " + switchingview + " and with webview id " + webviewids[uniqueid])
    ipcRenderer.send('closetab', [
        webviewids[tabprocessesindentifier['tab-' + focusedtab]],
        webviewids[uniqueid]
    ])
    focusedtab = parseInt(getKeyByValue(tabprocessesindentifier, uniqueid).replace('tab-', ''))
    resetFocusState()
    updateBackForwardButton()
    resizeWebview()
    addEventListenerToTabs()
    document.getElementById('tab-' + focusedtab).style.color = '#00b6ff'
    ipcRenderer.send('webtitlechange', BrowserView.fromId(webviewids[uniqueid]).webContents.getTitle())
}

function resetFocusState() {
    const tabs = document.getElementById('tabs').children
    for (let i = 0; i < tabs.length; i++) {
        tabs.item(i).style.color = 'black'
    }
}

function updateBackForwardButton() {
    const BrowserView = require('electron').remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    if (currentview.webContents.canGoBack()) {
        document.getElementById('backBtn').style.color = 'black'
        document.getElementById('backBtn').disabled = false
    } else {
        document.getElementById('backBtn').style.color = 'grey'
        document.getElementById('backBtn').disabled = true
    }
    if (currentview.webContents.canGoForward()) {
        document.getElementById('forwardBtn').style.color = 'black'
        document.getElementById('forwardBtn').disabled = false
    } else {
        document.getElementById('forwardBtn').style.color = 'grey'
        document.getElementById('forwardBtn').disabled = true
    }
}

function releaseWebView(uniqueid) {
    const BrowserView = remote.BrowserView
    remote.getCurrentWindow().removeBrowserView(BrowserView.fromId(webviewids[uniqueid]))
    BrowserView.fromId(webviewids[uniqueid]).destroy()
    delete BrowserView.fromId(webviewids[uniqueid])
}

function reloadWebView(uniqueid, withCache = true) {
    const BrowserView = require('electron').remote.BrowserView
    switch (withCache) {
        case true:
            BrowserView.fromId(webviewids[uniqueid]).webContents.reload()
            break

        case false:
            BrowserView.fromId(webviewids[uniqueid]).webContents.reloadIgnoringCache()
            break
    }
    console.log("Reloaded WebView " + webviewids[uniqueid])
}

function navigateTO(url) {
    const { getURL } = require('./components/zinc-urls/index')
    const { remote } = require('electron')
    if (url.startsWith('zinc://')) {
        remote.BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]]).webContents.loadFile(getURL(url.replace('zinc://', '')))
    } else {
        remote.BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]]).webContents.loadURL(url)
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getKeyByValue(object, value) {
    try {
        return Object.keys(object).find(key => object[key] === value);
    } catch {
        return null
    }
}

module.exports = { closeFocusedTab, newTabOperation }
