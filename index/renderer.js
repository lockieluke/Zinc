const {ipcRenderer, remote} = require('electron')

const closeBtn = document.getElementById('closebtn')
closeBtn.addEventListener('click', async () => {
    ipcRenderer.send('close');
});

const maxBtn = document.getElementById('maxbtn')
maxBtn.addEventListener('click', async () => {
    ipcRenderer.send('togglemax');
});

const minBtn = document.getElementById('minBtn')

minBtn.addEventListener('click', async () => {
    ipcRenderer.send('minimize');
})

const win = require('electron').remote.getCurrentWindow()

win.addListener('maximize', async ()=>{
    await resizeWebview()
})

win.addListener('resize', async ()=>{
    await resizeWebview()
})

ipcRenderer.on('new-tab', async (_event, args) => {
    newTabOperation(args)
    addEventListenerToTabs()
})

ipcRenderer.on('reloadpage', async (_event, args) => {
    reloadWebView(tabprocessesindentifier['tab-' + focusedtab], args);
});

ipcRenderer.on('navi-history', async () => {
    newTabOperation('webby://history');
});

ipcRenderer.on('home', async (_event, _args) => {
    navigateTO("webby://newtab");
});

ipcRenderer.on('back', ()=>{
    goBack()
})

ipcRenderer.on('forward', ()=>{
    goForward()
})

ipcRenderer.on('savepage', ()=>{
    savePage()
})

ipcRenderer.on('print', ()=>{
    printPage()
})

ipcRenderer.on('undo', async () => {
    const BrowserView = require('electron').remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.executeJavaScript('document.execCommand("undo")')
})

ipcRenderer.on('redo', async () => {
    const BrowserView = require('electron').remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.executeJavaScript('document.execCommand("redo")')
})

ipcRenderer.on('cut', async () => {
    const BrowserView = require('electron').remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.cut()
})

ipcRenderer.on('copy', async () => {
    const BrowserView = require('electron').remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.copy()
})

ipcRenderer.on('paste', async () => {
    const BrowserView = require('electron').remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.paste()
})

ipcRenderer.on('selectall', async () => {
    const BrowserView = require('electron').remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.selectAll()
})

ipcRenderer.on('inspect-eli-cu', async (_event, args) => {
    const BrowserView = require('electron').remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.inspectElement(args[0], args[1])
})

ipcRenderer.on('open-img-newtab', async (_event, args) => {
    const BrowserView = require('electron').remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    newTabOperation(args)
})

ipcRenderer.on('saveimg', async (_event, args) => {
    const dialog = remote.dialog
    const saveDialog = dialog.showSaveDialogSync(win, {
        title: "Save As",
        buttonLabel: "Save",
        defaultPath: '~/' + args[0]
    })

    if (saveDialog) {
        console.log("Saving image from " + args[0])
        // remove Base64 stuff from the Image
        toDataURL(args[0], async dataURL => {
            require('fs').writeFile(saveDialog, new Buffer(dataURL.replace(/^data:image\/\w+;base64,/, ""), 'base64'), function (err) {
                if (err != null) {
                    console.log(err.message)
                }
            })
        })
    }

    function toDataURL(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            const reader = new FileReader();
            reader.onloadend = function() {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }
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

window.onload = async function () {
    await sleep(0).then(r => init())
}

function init() {
    newTabOperation("webby://newtab")
}

document.getElementById('newtab').addEventListener('click', ()=>{
    newTabOperation("webby://newtab")
})

document.getElementById('closetab').addEventListener('click', ()=>{
    if (!closelocked) {
        closeFocusedTab()
    }
})

document.getElementById('backBtn').addEventListener('click', ()=>{
    goBack()
})

document.getElementById('forwardBtn').addEventListener('click', ()=>{
    goForward()
})

document.getElementById('menuBtn').addEventListener('click', async ()=>{
    const {ipcRenderer} = require('electron')
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
            {extensions: ['html', 'htm'], name: 'Webpage, Complete'}
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

async function newTabOperation(url) {
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
            nodeIntegration: url.startsWith('webby://'),
            contextIsolation: !url.startsWith('webby://'),
            enableRemoteModule: url.startsWith('webby://'),
            preload: require('path').join(__dirname, 'preload.js'),
        }
    })
    webview.webContents.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36'
    // webview.webContents.userAgent = webview.webContents.userAgent
    //     .replace(/ Webby\\?.([^\s]+)/g, '')
    //     .replace(/ Electron\\?.([^\s]+)/g, '')
    //     .replace(/Chrome\\?.([^\s]+)/g, 'Chrome/85.0.4183.83');
    const win = require('electron').remote.getCurrentWindow()
    win.setBrowserView(webview)
    webviewids[tabcounter] = webview.id
    console.log("Changed WebView ID to " + webview.id)
    if (url.startsWith('webby://')) {
        const {getURL} = require('./components/webby-urls/index')
        webview.webContents.loadFile(getURL(url.replace('webby://', '')))
    } else {
        webview.webContents.loadURL(url)
    }
    ipcRenderer.send('webview:load', webview.id)
    webview.setBackgroundColor('#ffffff')
    focusOntoTab(tabprocessesindentifier[newtab.id])
    webview.webContents.on('did-finish-load' || 'page-title-updated' || 'did-frame-finish-load', async () => {
        const { storeHistory } = require('./components/history/index')
        renewTabTitle(webview.webContents.getTitle(), newtab.id, webview)
        storeHistory(webview.webContents.getTitle(), webview.webContents.getURL(), `${new Date().getHours()}:${new Date().getMinutes()}`, `${new Date().getFullYear()};${new Date().getMonth()};${new Date().getDate()}`)
    })
    webview.webContents.on('page-title-updated', async () => {
        renewTabTitle(webview.webContents.getTitle(), newtab.id, webview)
    })
    webview.webContents.on('will-redirect', async () => {
        renewTabTitle("Loading", newtab.id, webview)
    })
    const dialog = require('electron').remote.dialog
    webview.webContents.session.setPermissionRequestHandler(async (webContents, permission, callback, details) => {
        const permdialog = await dialog.showMessageBox(require('electron').remote.getCurrentWindow(), {
            title: "webby",
            message: webContents.getURL() + " would like to have " + permission + " permission.  Approving permissions to untrusted websites may lead to unpredictable security issue.",
            buttons: [
                "Deny",
                "Allow Anyway"
            ],
            type: 'question'
        })
        switch (permdialog) {
            case 0:
                callback(false)
                break

            case 1:
                callback(true)
                break
        }
    })
    addEventListenerToTabs()
    tabcount++
    tabcounter++
}

function renewTabTitle(title, tabid, webview) {
    const {ipcRenderer} = require('electron')
    document.getElementById('tabtitle-' + tabprocessesindentifier[tabid]).innerText = title
    updateBackForwardButton()
    if (tabid === 'tab-' + focusedtab) {
        ipcRenderer.send('webtitlechange', webview.webContents.getTitle())
    }
    taburls[tabprocessesindentifier[newtab.id]] = webview.webContents.getURL()
    document.getElementById(tabid).title = webview.webContents.getTitle()
}

function resizeWebview() {
    const {remote} = require('electron')
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
        closelocked = true
        let closingtabdom = document.getElementById('tab-' + focusedtab)
        closingtabdom.style.animation = 'close-tab 0.3s forwards ease-out'
        closingtabdom.addEventListener('animationend', async () => {
            let olduniqueid = tabprocessesindentifier['tab-' + focusedtab]
            let olddomid = closingtabdom.id
            delete tabprocessesindentifier['tab-' + focusedtab]
            closingtabdom.remove()
            console.log("Reordering tab children")
            for (let i = 0; i < document.getElementById('tabs').children.length; i++) {
                document.getElementById('tabs').children.item(i).id = 'tab-' + i
            };
            let temptabpro = {}
            for (let i = 0; i < Object.keys(tabprocessesindentifier).length; i++) {
                temptabpro['tab-' + i] = tabprocessesindentifier[Object.keys(tabprocessesindentifier)[i]]
            }
            tabprocessesindentifier = temptabpro
            releaseWebView(olduniqueid)

            if (document.getElementById('tab-' + (focusedtab - 1)) != null) {
                document.getElementById('tab-' + (focusedtab - 1)).click()
            } else {
                document.getElementById('tab-' + (focusedtab)).click()
            }

            closelocked = false
        })
        tabcount -= 1
    } else {
        require('electron').remote.getCurrentWindow().close()
    }
}

function addEventListenerToTabs() {
    for (let i = 0; i < tabcount; i++) {
        const currenthandlingtab = document.getElementById('tab-' + i)
        let currentprocessid = tabprocessesindentifier[currenthandlingtab.id]
        currenthandlingtab.addEventListener('click', (event)=>{
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
    // win.removeBrowserView(BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]]))
    // win.addBrowserView(switchingview)
    
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
    const {getURL} = require('./components/webby-urls/index')
    const {remote} = require('electron')
    if (url.startsWith('webby://')) {
        remote.BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]]).webContents.loadFile(getURL(url.replace('webby://', '')))
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
    } catch (e) {
        return null
    }
}
