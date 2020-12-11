import {app, BrowserWindow} from 'electron';
import * as electronIsDev from "electron-is-dev";
import initLoggerService from './main/logger'
import initWinControls from './main/browser/winCtrls'
import initTabMNG from './main/browser/tabMng'
import initWinEvents from './main/window'
import initDevService from './main/dev'
import * as path from 'path';
import registerTabActionsKeystrokes from "./main/keystrokes/tabActions";
import NativeCommunication from "./main/native/communication";
import {getJavaPath, runJar} from "./main/native";
import getAppRoot from "./main/utils/appPath";

function createWindow(): void {

    let nativeCommunication: NativeCommunication = null;

    const win: BrowserWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        title: "Zinc",
        frame: false,
        backgroundColor: '#ffffff',
        minHeight: 60,
        minWidth: 180,
        icon: path.join(__dirname, '..', 'artwork', 'Zinc.png'),
        show: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: false,
            devTools: electronIsDev,
        }
    })

    win.setMenu(null);

    win.loadFile('window-ui/index.html')

    requireInitScripts();

    win.on('close', function () {
        if (BrowserWindow.getAllWindows().length < 1) {
            app.quit();
            nativeCommunication.getWS().send('QuitZinc');
            nativeCommunication.close();
        }
    })

    function requireInitScripts() {
        nativeCommunication = new NativeCommunication('8000', 'localhost');
        nativeCommunication.initialize();
        if (process.env.NO_NATIVE_JAR !== 'true') {
            console.log("[Zinc Native] Starting bundled Zinc Native");
            runJar(getJavaPath(app), path.join(getAppRoot(), 'native', 'ZincNative.jar'), '', function (stdout, stderr) {
                console.log(stdout, stderr);
            })
        }
        initWinControls(win);
        initTabMNG(win);
        initLoggerService();
        initWinEvents(win);
        registerTabActionsKeystrokes(win);
        if (!app.isPackaged)
            initDevService(win);
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        app.quit();
})

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length == 0)
        createWindow();
})