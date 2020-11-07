"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const keystrokes_1 = require("../keystrokes");
let totaltab = 0;
let lifetimetabs = 0;
let focusedtabs = 0;
let webviewids = {};
const currentwin = electron_1.BrowserWindow.getFocusedWindow();
keystrokes_1.registerLocalKeyStroke('CommandOrControl+Shift+I', currentwin, function () {
    electron_1.BrowserView.fromId(webviewids['tab-' + focusedtabs]).webContents.openDevTools({
        mode: 'right'
    });
});
electron_1.ipcMain.on('tabmng-new', function (event, args) {
    focusedtabs = totaltab;
    const webview = new electron_1.BrowserView({
        webPreferences: {
            nodeIntegration: false,
            enableRemoteModule: false,
            contextIsolation: true,
            preload: path.join(__dirname, '../../window/preloads/preload.js')
        }
    });
    currentwin.setBrowserView(webview);
    webview.webContents.loadURL(args[0]).then(function () {
        resizeWebView();
        currentwin.on('resize', function () {
            resizeWebView();
        });
        function resizeWebView() {
            if (process.platform === 'win32' && currentwin.isMaximized()) {
                webview.setBounds({
                    width: currentwin.getSize()[0] - 10,
                    height: currentwin.getSize()[1] - 77,
                    y: 65,
                    x: 0
                });
            }
            else {
                webview.setBounds({
                    width: currentwin.getSize()[0],
                    height: currentwin.getSize()[1] - 63,
                    y: 63,
                    x: 0
                });
            }
        }
    });
    const domid = 'tab-' + totaltab;
    webview.webContents.on('page-title-updated', function (event, title, explicitSet) {
        currentwin.webContents.send('tabmng-browser-titleupdated', [domid, title]);
        if (focusedtabs == parseInt(domid.replace('tab-', '')))
            currentwin.setTitle("Zinc - " + title);
    });
    webview.webContents.on('did-finish-load', function () {
        currentwin.webContents.send('tabmng-browser-did-finish-load', [webview.webContents.canGoBack(), webview.webContents.canGoForward()]);
    });
    webviewids[domid] = webview.id;
    event.returnValue = totaltab;
    totaltab += 1;
    lifetimetabs += 1;
});
electron_1.ipcMain.on('tabmng-getinfo', function (event, args) {
    event.returnValue = [totaltab, lifetimetabs, focusedtabs];
});
electron_1.ipcMain.on('tabmng-setinfo', function (event, args) {
    switch (args[0]) {
        case 'total':
            totaltab = parseInt(args[1]);
            break;
        case 'focus':
            focusedtabs = parseInt(args[1]);
            break;
        case 'lifetime':
            lifetimetabs = parseInt(args[1]);
            break;
    }
});
electron_1.ipcMain.on('tabmng-focus', function (event, args) {
    focusedtabs = parseInt(args);
    const bv = electron_1.BrowserView.fromId(webviewids['tab-' + focusedtabs]);
    currentwin.setBrowserView(bv);
    if (focusedtabs == parseInt(args))
        currentwin.setTitle("Zinc - " + bv.webContents.getTitle());
});
electron_1.ipcMain.on('tabmng-close', function (event, args) {
    delete webviewids[args];
    let tempwebviewids = {};
    for (let i = 0; i < Object.keys(webviewids).length; i++) {
        tempwebviewids["tab-" + i] = webviewids[Object.keys(webviewids)[i]];
    }
    webviewids = tempwebviewids;
    totaltab -= 1;
});
electron_1.ipcMain.on('tabmng-back', function () {
    const currentWebView = electron_1.BrowserView.fromId(webviewids['tab-' + focusedtabs]);
    currentWebView.webContents.goBack();
});
electron_1.ipcMain.on('tabmng-forward', function () {
    const currentWebView = electron_1.BrowserView.fromId(webviewids['tab-' + focusedtabs]);
    currentWebView.webContents.goForward();
});
//# sourceMappingURL=tabMng.js.map