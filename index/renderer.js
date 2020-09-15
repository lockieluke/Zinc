const closeBtn = document.getElementById('closebtn')

closeBtn.addEventListener('click', ()=>{
    const ipcRenderer = require('electron').ipcRenderer
    ipcRenderer.send('close')
})

const maxBtn = document.getElementById('maxbtn')

maxBtn.addEventListener('click', ()=>{
    const ipcRenderer = require('electron').ipcRenderer
    ipcRenderer.send('togglemax')
})

const minBtn = document.getElementById('minBtn')

minBtn.addEventListener('click', ()=>{
    const ipcRenderer = require('electron').ipcRenderer
    ipcRenderer.send('minimize')
})

const win = require('electron').remote.getCurrentWindow()

win.addListener('maximize', async ()=>{
    await resizeWebview()
})

win.addListener('resize', async ()=>{
    await resizeWebview()
})

require('electron').ipcRenderer.on('new-tab', (event, args)=>{
    newTabOperation(args)
    addEventListenerToTabs()
})

require('electron').ipcRenderer.on('reloadpage', (event, args)=>{
    reloadWebView(tabprocessesindentifier['tab-' + focusedtab], args)
})

require('electron').ipcRenderer.on('home', (event, args)=>{
    navigateTO("webby://newtab")
})

require('electron').ipcRenderer.on('back', ()=>{
    goBack()
})

require('electron').ipcRenderer.on('forward', ()=>{
    goForward()
})

require('electron').ipcRenderer.on('savepage', ()=>{
    savePage()
})

require('electron').ipcRenderer.on('print', ()=>{
    printPage()
})

require('electron').ipcRenderer.on('undo', ()=>{
    const BrowserView = require('electron').remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.executeJavaScript('document.execCommand("undo")')
})

require('electron').ipcRenderer.on('redo', ()=>{
    const BrowserView = require('electron').remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.executeJavaScript('document.execCommand("redo")')
})

require('electron').ipcRenderer.on('cut', ()=>{
    const BrowserView = require('electron').remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.cut()
})

require('electron').ipcRenderer.on('copy', ()=>{
    const BrowserView = require('electron').remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.copy()
})

require('electron').ipcRenderer.on('paste', ()=>{
    const BrowserView = require('electron').remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.paste()
})

require('electron').ipcRenderer.on('selectall', ()=>{
    const BrowserView = require('electron').remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.selectAll()
})

require('electron').ipcRenderer.on('inspect-eli-cu', (event, args)=>{
    const BrowserView = require('electron').remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.inspectElement(args[0], args[1])
})

require('electron').ipcRenderer.on('open-img-newtab', (event, args)=>{
    const BrowserView = require('electron').remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    newTabOperation(args)
})

require('electron').ipcRenderer.on('saveimg', (event, args)=>{
    const BrowserView = require('electron').remote.BrowserView
    const NativeImage = require('electron').remote.nativeImage
    const dialog = require('electron').remote.dialog
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])

    const saveDialog = dialog.showSaveDialogSync({
        title: "Save As",
        buttonLabel: "Save",
        defaultPath: '~/' + args[0]
    })

    if (saveDialog != undefined) {
        // remove Base64 stuff from the Image
        toDataURL(args[0], function (dataURL) {
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

require('electron').remote.globalShortcut.register('CommandOrControl+T', ()=>{
    if (require('electron').remote.getCurrentWindow().isFocused()) {
        newTabOperation("webby://newtab")
    }
})

require('electron').remote.globalShortcut.register('CommandOrControl+W', ()=>{
    if (require('electron').remote.getCurrentWindow().isFocused()) {
        if (!closelocked) {
            closeFocusedTabNew()
        }
    }
})

document.getElementById('newtab').addEventListener('click', ()=>{
    newTabOperation("webby://newtab")
})

document.getElementById('closetab').addEventListener('click', ()=>{
    if (!closelocked) {
        closeFocusedTabNew()
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

function goBack() {
    const BrowserView = require('electron').remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.goBack()
}

function goForward() {
    const BrowserView = require('electron').remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.goForward()
}

function savePage() {
    const BrowserView = require('electron').remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    const savePath = require('electron').remote.dialog.showSaveDialogSync(require('electron').remote.getCurrentWindow(), {
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

function printPage() {
    const BrowserView = require('electron').remote.BrowserView
    const currentview = BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]])
    currentview.webContents.print({

    })
}

function newTabOperation(url) {
    let newtab = document.createElement('div')
    newtab.className = 'tab'
    newtab.id = 'tab-' + tabcount
    let tabtitle = document.createElement('h6')
    tabtitle.innerText = "Loading"
    tabtitle.id = 'tabtitle-' + tabcounter
    newtab.appendChild(tabtitle)
    document.getElementsByClassName('tabs').item(0).appendChild(newtab)
    console.log("Total Tab Count(start from 0): " + tabcount)
    tabprocessesindentifier[newtab.id] = tabcounter
    focusedtab = parseInt(newtab.id.replace('tab-', ''))
    const BrowserView = require('electron').remote.BrowserView
    const {ipcRenderer} = require('electron')
    const webview = new BrowserView({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            enableRemoteModule: false,
            plugins: true,
            nativeWindowOpen: true,
            webSecurity: true,
            javascript: true,
            preload: require('path').join(__dirname, 'preload.js'),
            autoplayPolicy: 'no-user-gesture-required',
            allowRunningInsecureContent: true,
        }
    })
    webview.webContents.setFrameRate(60)
    webview.webContents.userAgent = webview.webContents.userAgent
        .replace(/ Webby\\?.([^\s]+)/g, '')
        .replace(/ Electron\\?.([^\s]+)/g, '')
        .replace(/Chrome\\?.([^\s]+)/g, 'Chrome/85.0.4183.83');
    const win = require('electron').remote.getCurrentWindow()
    win.addBrowserView(webview)
    webviewids[tabcounter] = webview.id
    console.log("Changed WebView ID to " + webview.id)

    if (url.startsWith('webby://')) {
        webview.webContents.loadFile('newtab/index.html')
        ipcRenderer.send('webview:load', webview.id)
    } else {
        webview.webContents.loadURL(url)
        ipcRenderer.send('webview:load', webview.id)
    }
    webview.webContents.enableDeviceEmulation({
        screenPosition: "desktop",
    })
    webview.setBackgroundColor('#ffffff')
    focusOntoTab(tabprocessesindentifier[newtab.id])
    webview.webContents.on('dom-ready', ()=>{
        document.getElementById('tabtitle-' + tabprocessesindentifier[newtab.id]).innerText = webview.webContents.getTitle()
        updateBackForwardButton()
        if (newtab.id === 'tab-' + focusedtab) {
            ipcRenderer.send('webtitlechange', webview.webContents.getTitle())
        }
        taburls[tabprocessesindentifier[newtab.id]] = webview.webContents.getURL()
        newtab.title = webview.webContents.getTitle()
    })
    webview.webContents.on('did-start-loading', ()=>{
        document.getElementById('tabtitle-' + tabprocessesindentifier[newtab.id]).innerText = "Loading"
    })
    webview.webContents.on('page-title-updated', ()=>{
        document.getElementById('tabtitle-' + tabprocessesindentifier[newtab.id]).innerText = webview.webContents.getTitle()
        updateBackForwardButton()
        if (newtab.id === 'tab-' + focusedtab) {
            ipcRenderer.send('webtitlechange', webview.webContents.getTitle())
        }
        taburls[tabprocessesindentifier[newtab.id]] = webview.webContents.getURL()
        newtab.title = webview.webContents.getTitle()
    })
    const dialog = require('electron').remote.dialog
    webview.webContents.session.setPermissionRequestHandler((webContents, permission, callback, details) => {
        const permdialog = dialog.showMessageBoxSync(require('electron').remote.getCurrentWindow(), {
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

function closeFocusedTabNew() {
    if (tabcount > 1) {
        closelocked = true
        let closingtabdom = document.getElementById('tab-' + focusedtab)
        closingtabdom.style.animation = 'close-tab 0.3s forwards ease-out'
        closingtabdom.addEventListener('animationend', ()=>{
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

            const tablastdomid = tabcount - 1
            const tabnextdomid = tabcount + 1

            if (document.getElementById('tab-' + tablastdomid)) {
                focusOntoTab(tabprocessesindentifier['tab-' + tablastdomid])
            } else {
                focusOntoTab(tabprocessesindentifier['tab-' + tabnextdomid])
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
    const win = require('electron').remote.BrowserWindow.getFocusedWindow()
    const switchingview = BrowserView.fromId(webviewids[uniqueid])
    console.log("Switching to tab " + switchingview + " and with webview id " + webviewids[uniqueid])
    // win.removeBrowserView(BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]]))
    // win.addBrowserView(switchingview)
    const ipcRenderer = require('electron').ipcRenderer
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
    win.focus();
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
    const BrowserView = require('electron').remote.BrowserView
    require('electron').remote.getCurrentWindow().removeBrowserView(BrowserView.fromId(webviewids[uniqueid]))
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
    const {remote} = require('electron')
    if (url.startsWith('webby://')) {
        remote.BrowserView.fromId(webviewids[tabprocessesindentifier['tab-' + focusedtab]]).webContents.loadFile('newtab/index.html')
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