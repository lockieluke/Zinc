import {BrowserView, BrowserWindow, ipcMain} from 'electron'
import * as path from 'path'
import {registerLocalKeyStroke} from '../keystrokes'
import showCtxMenu from '../ctxMenus'

export default function main() {
    let totaltab: number = 0;
    let lifetimetabs: number = 0;
    let focusedtabs: number = 0;

    let webviewids: object = {};

    const currentwin: BrowserWindow = BrowserWindow.getFocusedWindow();

    registerLocalKeyStroke('CommandOrControl+Shift+I', currentwin, function () {
        BrowserView.fromId(webviewids['tab-' + focusedtabs]).webContents.openDevTools({
            mode: 'right'
        })
    })

    ipcMain.on('tabmng-new', function (event, args: string[]) {

        focusedtabs = totaltab;

        const webview: BrowserView = new BrowserView({
            webPreferences: {
                nodeIntegration: false,
                enableRemoteModule: false,
                contextIsolation: true,
                preload: path.join(__dirname, '../../window/preloads/preload.js')
            }
        })

        currentwin.setBrowserView(webview);
        webview.webContents.loadURL(args[0]).then(function () {
            resizeWebView();
            currentwin.on('resize', function () {
                resizeWebView();
            })

            function resizeWebView() {
                if (process.platform === 'win32' && currentwin.isMaximized()) {
                    webview.setBounds({
                        width: currentwin.getSize()[0] - 10,
                        height: currentwin.getSize()[1] - 77,
                        y: 65,
                        x: 0
                    })
                } else {
                    webview.setBounds({
                        width: currentwin.getSize()[0],
                        height: currentwin.getSize()[1] - 63,
                        y: 63,
                        x: 0
                    })
                }
            }
        });

        const domid: string = 'tab-' + totaltab;

        webview.webContents.on('context-menu', function (event, param) {
            showCtxMenu(currentwin, param);
        })

        webview.webContents.on('page-title-updated', function (event, title, explicitSet) {
            currentwin.webContents.send('tabmng-browser-titleupdated', [domid, title]);
            if (focusedtabs == parseInt(domid.replace('tab-', '')))
                currentwin.setTitle("Zinc - " + title);
        })
        webview.webContents.on('did-finish-load', function () {
            // webview.webContents.insertCSS(fs.readFileSync(path.join(__dirname, '..', '..', '..', 'window', 'ui', 'native-scrollbar.css'), {encoding: 'utf8'}), {
            //     cssOrigin: 'author'
            // })
            currentwin.webContents.send('tabmng-browser-backforward', [webview.webContents.canGoBack(), webview.webContents.canGoForward()]);
        })
        webviewids[domid] = webview.id;

        event.returnValue = totaltab;

        totaltab += 1;
        lifetimetabs += 1;
    })

    ipcMain.on('tabmng-getinfo', function (event, args) {
        event.returnValue = [totaltab, lifetimetabs, focusedtabs];
    })

    ipcMain.on('tabmng-setinfo', function (event, args: string[]) {
        switch (args[0]) {
            case 'total':
                totaltab = parseInt(args[1]);
                break

            case 'focus':
                focusedtabs = parseInt(args[1]);
                break;

            case 'lifetime':
                lifetimetabs = parseInt(args[1]);
                break
        }
    })

    ipcMain.on('tabmng-focus', function (event, args) {
        const bv: BrowserView = BrowserView.fromId(webviewids['tab-' + args]);
        currentwin.setBrowserView(bv);
        currentwin.setTitle("Zinc - " + bv.webContents.getTitle());
        focusedtabs = args;
    })

    ipcMain.on('tabmng-close', function (event, args) {
        let handlingBV: BrowserView = BrowserView.fromId(webviewids[args]);
        currentwin.removeBrowserView(handlingBV);
        handlingBV.destroy();
        handlingBV = null;
        delete webviewids[args];
        let tempwebviewids: object = {};
        for (let i = 0; i < Object.keys(webviewids).length; i++) {
            tempwebviewids["tab-" + i] = webviewids[Object.keys(webviewids)[i]];
        }
        webviewids = tempwebviewids;
        totaltab -= 1;
    })

    ipcMain.on('tabmng-back', function () {
        const currentWebView: BrowserView = BrowserView.fromId(webviewids['tab-' + focusedtabs]);
        currentWebView.webContents.goBack();
    })

    ipcMain.on('tabmng-forward', function () {
        const currentWebView: BrowserView = BrowserView.fromId(webviewids['tab-' + focusedtabs]);
        currentWebView.webContents.goForward();
    })
}