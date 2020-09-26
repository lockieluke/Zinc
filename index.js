"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var electron_1 = require("electron");
var isDev = require("electron-is-dev");
var index_1 = require("./main/components/menu/index");
require(__dirname + '/main/components/ipcEvents/index');
var countup;
var timer;
if (isDev) {
    countup = 0;
    timer = setInterval(function () {
        countup++;
    }, 1);
}
function init() {
    var _this = this;
    var win = new electron_1.BrowserWindow({
        width: 1280,
        height: 720,
        center: true,
        show: false,
        title: "Zinc",
        frame: false,
        backgroundColor: '#e8eaed',
        webPreferences: {
            worldSafeExecuteJavaScript: true,
            nodeIntegration: true,
            webviewTag: true,
            enableRemoteModule: true,
            nodeIntegrationInSubFrames: true,
            devTools: isDev,
            v8CacheOptions: 'bypassHeatCheckAndEagerCompile'
        },
        minHeight: 80,
        minWidth: 180,
        icon: __dirname + '/artwork/Zinc.png',
        opacity: 0
    });
    electron_1.app.commandLine.appendSwitch('--disable-backing-store-limit');
    electron_1.app.commandLine.appendSwitch('--disable-gpu-memory-buffer-compositor-resources');
    if (process.platform === 'linux') {
        electron_1.app.commandLine.appendSwitch('--enable-transparent-visuals --disable-gpu'); //Disable gpu in order to ensure transparent windows work on Linux
    }
    electron_1.nativeTheme.themeSource = 'dark';
    electron_1.app.setAsDefaultProtocolClient('zinc');
    win.loadFile('index/index.html');
    win.setSkipTaskbar(true);
    win.setMenuBarVisibility(true);
    win.webContents.on('did-finish-load', function () {
        win.show();
        require('./main/components/shortcuts/index');
        win.webContents.setFrameRate(60);
        require('./main/components/menubar');
        win.setSkipTaskbar(false);
        win.setOpacity(1);
        win.once('show', function () {
            if (isDev) {
                process.stdout.write(`Launched Zinc in ${String(countup)}s\n`);
            }
        });
    });
<<<<<<< HEAD
    electron_1.ipcMain.on('webtitlechange', function (_event, args) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            win.title = "Zinc - " + String(args);
            return [2 /*return*/];
=======
    electron_1.ipcMain.on('webtitlechange', async (_event, args) => {
        win.title = `Zinc - ${String(args)}`;
    });
    electron_1.ipcMain.on('webview:load', async (_event, args) => {
        electron_1.BrowserView.fromId(args).webContents.on('new-window', (event, url) => {
            event.preventDefault();
            electron_1.BrowserWindow.getAllWindows()[0].webContents.send('new-tab', url);
>>>>>>> cc8285608e4801bc1231ca0e15f7a7868eb2e35d
        });
    }); });
    electron_1.ipcMain.on('webview:load', function (_event, args) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            electron_1.BrowserView.fromId(args).webContents.on('new-window', function (event, url) {
                event.preventDefault();
                electron_1.BrowserWindow.getAllWindows()[0].webContents.send('new-tab', url);
            });
            return [2 /*return*/];
        });
    }); });
    electron_1.ipcMain.on('home', function (_event, _args) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            index_1.closeMenu();
            electron_1.BrowserWindow.getAllWindows()[0].webContents.send('home');
            return [2 /*return*/];
        });
    }); });
}
electron_1.ipcMain.on('menu:open', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        index_1.openMenu();
        return [2 /*return*/];
    });
}); });
electron_1.ipcMain.on('newtab', function () {
    index_1.closeMenu();
    electron_1.BrowserWindow.getAllWindows()[0].webContents.send('new-tab', 'zinc://newtab');
});
electron_1.ipcMain.on('newwin', function () {
    electron_1.shell.openPath(electron_1.app.getPath('exe'));
});
electron_1.ipcMain.on('closetab', function (_event, args) {
    var currentwin = electron_1.BrowserWindow.getAllWindows()[0];
    try {
        currentwin.removeBrowserView(electron_1.BrowserView.fromId(args[0]));
        currentwin.addBrowserView(electron_1.BrowserView.fromId(args[1]));
    }
    catch (_a) { }
});
electron_1.ipcMain.on('quit', function (_event, args) {
    index_1.closeMenu();
    if (args) {
        electron_1.BrowserWindow.getAllWindows()[0].close();
    }
    process.exit(0);
});
electron_1.ipcMain.on('about', function (_event, _args) {
    index_1.closeMenu();
    electron_1.BrowserWindow.getAllWindows()[0].webContents.send('new-tab', 'zinc://about');
});
electron_1.ipcMain.on('reloadpage', function (_event, args) {
    index_1.closeMenu();
    var win = electron_1.BrowserWindow.getAllWindows()[0];
    if (win) {
        win.webContents.send('reloadpage', args);
    }
});
electron_1.ipcMain.on('navi-history', function () {
    index_1.closeMenu();
    var win = electron_1.BrowserWindow.getAllWindows()[0];
    if (win) {
        win.webContents.send('navi-history');
    }
});
electron_1.app.whenReady().then(function () {
    init();
    electron_1.app.on('activate', function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0 && process.platform === 'darwin')
            electron_1.shell.openPath(electron_1.app.getPath('exe'));
    });
});
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.app.on('will-quit', index_1.closeMenu);
