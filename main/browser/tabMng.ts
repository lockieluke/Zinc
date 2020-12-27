import { app, BrowserView, BrowserWindow, ipcMain } from "electron";
import showCtxMenu from "../ctxMenus";
import TabWrapper from "./tabWrapper";
import electronLocalKeystroke from "../keystrokes";
import { WebView } from "./webView";
import NativeCommunication from "../native/communication";
import ZincNative from "../native/zincNative";

export let currentBV: BrowserView = null;

export default function main(window: BrowserWindow) {
  let totaltab = 0;
  let lifetimetabs = 0;
  let focusedtabs = 0;

  let webviewids: object = {};
  const nativeCommunication: NativeCommunication = (global as any)
    .nativeCommunication;
  const zincNative: ZincNative = new ZincNative(nativeCommunication, app);

  const currentwin: BrowserWindow = window;

  electronLocalKeystroke.registerLocalKeyStroke(
    'CommandOrControl+Shift+I',
    currentwin,
    function () {
      const focusedBV: WebView = WebView.fromId(
        webviewids['tab-' + focusedtabs],
      );
      if (!focusedBV.webContents.isDevToolsOpened()) {
        focusedBV.webContents.openDevTools({
          mode: 'undocked',
        });
        focusedBV.webContents.closeDevTools();
      }
      focusedBV.webContents.openDevTools({
        mode: 'right',
      });
    },
  );

  ipcMain.on('tabmng-new', function (event, args: string[]) {
    focusedtabs = totaltab;

    const webview: WebView = new WebView(currentwin, args[0]);

    const domid: string = 'tab-' + totaltab;

    webview.webContents.on('context-menu', function (event, param) {
      showCtxMenu(currentwin, webview, param);
    });

    webview.webContents.on(
      'page-title-updated',
      function (event, title, explicitSet) {
        currentwin.webContents.send('tabmng-browser-titleupdated', [
          domid,
          title,
        ]);
        if (focusedtabs == parseInt(domid.replace('tab-', ''))) {
          currentwin.setTitle('Zinc - ' + title);
          updateRPCDescription(nativeCommunication.isReady);
        }
      },
    );
    webview.webContents.on(
      'new-window',
      function (
        event: Electron.NewWindowWebContentsEvent,
        url: string,
        frameName: string,
        disposition,
      ) {
        event.preventDefault();
        TabWrapper.newTab(url);
      },
    );
    webview.webContents.on('did-finish-load', function () {
      currentwin.webContents.send('tabmng-browser-backforward', [
        webview.webContents.canGoBack(),
        webview.webContents.canGoForward(),
      ]);
    });
    webviewids[domid] = webview.webContents.id;

    event.returnValue = totaltab;

    totaltab += 1;
    lifetimetabs += 1;
  });

  ipcMain.on('tabmng-getinfo', function (event, args) {
    event.returnValue = [totaltab, lifetimetabs, focusedtabs];
  });

  ipcMain.on('tabmng-setinfo', function (event, args: string[]) {
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

  ipcMain.on('tabmng-focus', function (event, args) {
    const bv: WebView = WebView.fromId(webviewids['tab-' + args]);
    currentwin.setBrowserView(bv);
    currentwin.setTitle('Zinc - ' + bv.webContents.getTitle());
    focusedtabs = args;
    currentBV = bv;
  });

  ipcMain.on('tabmng-close', function (event, args) {
    let handlingBV: WebView = WebView.fromId(webviewids[args]);
    currentwin.removeBrowserView(handlingBV);
    WebView.destroyWebView(handlingBV);
    handlingBV.webContents.loadURL('about:blank');
    (handlingBV.webContents as any).destroy();
    handlingBV = null;
    delete webviewids[args];
    const tempwebviewids: object = {};
    for (let i = 0; i < Object.keys(webviewids).length; i++) {
      tempwebviewids['tab-' + i] = webviewids[Object.keys(webviewids)[i]];
    }
    webviewids = tempwebviewids;
    totaltab -= 1;
  });

  ipcMain.on('tabmng-back', function () {
    const currentWebView: BrowserView = WebView.fromId(
      webviewids['tab-' + focusedtabs],
    );
    currentWebView.webContents.goBack();
  });

  ipcMain.on('tabmng-forward', function () {
    const currentWebView: BrowserView = WebView.fromId(
      webviewids['tab-' + focusedtabs],
    );
    currentWebView.webContents.goForward();
  });

  ipcMain.on('tabmng-getcurrentbv', function (event, args) {
    event.returnValue = currentBV;
  });

  ipcMain.on('tabmng-getcurrentwin', function (event, args) {
    event.returnValue = currentwin;
  });

  function updateRPCDescription(condition: boolean) {
    if (nativeCommunication.isReady)
      zincNative.DiscordRPC.changeRPCDescription(
        currentBV.webContents.getTitle()
      );

    if (!condition) setTimeout(updateRPCDescription, 500);
  }
}
