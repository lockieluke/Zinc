import ZincNative from './main/native/zincNative';
import { app, BrowserWindow } from 'electron';
import * as electronIsDev from 'electron-is-dev';
import initWinControls from './main/browser/winCtrls';
import initTabMNG from './main/browser/tabMng';
import initWinEvents from './main/window';
import initDevService from './main/dev';
import * as path from 'path';
import registerTabActionsKeystrokes from './main/keystrokes/tabActions';
import NativeCommunication from './main/native/communication';
import defaultLogger, { LogLevel, LogTypes } from './main/logger/';
import initLoggerService from './main/logger/loggerService';
import StartupPerformance from './main/dev/startupPerformance';
import Startup from './main/dev/startup';

const launchPerformanceTimer: StartupPerformance = new StartupPerformance();
const zincNativePerformanceTimer: StartupPerformance = new StartupPerformance();
(global as any).zincNativePerformanceTimer = zincNativePerformanceTimer;

let nativeCommunication: NativeCommunication = null;
nativeCommunication = new NativeCommunication('8000', '127.0.0.1');
nativeCommunication.initialize();
(global as any).nativeCommunication = nativeCommunication;
const zincNative: ZincNative = new ZincNative(nativeCommunication, app);
zincNative.startup();

app.setPath(
  'userData',
  path.join(app.getPath('appData'), 'Zinc', 'User Session Data'),
);

function createWindow(): void {
  const win: BrowserWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    title: 'Zinc',
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
      contextIsolation: false,
    },
  });

  win.setMenu(null);

  win.loadFile('window-ui/index.html');

  requireInitScripts();

  win.on('close', function() {
    if (BrowserWindow.getAllWindows().length < 1) {
      app.quit();
      nativeCommunication.getWS().send('QuitZinc');
      nativeCommunication.close();
    }
  });

  win.webContents.once('did-finish-load', function() {
    launchPerformanceTimer.finishedStartup(function(startupTime: number) {
      defaultLogger(LogTypes.MainProcess, `Zinc is fully started up in ${startupTime} ms`, LogLevel.DevLog, app);
    });
  });

  function requireInitScripts() {
    initWinControls(win);
    initTabMNG(win);
    initWinEvents(win);
    initLoggerService();
    registerTabActionsKeystrokes(win);
    if (!app.isPackaged)
      initDevService(win);
  }
}

app.on('ready', function() {
  if (Startup.canStartup(app)) {
    Startup.printStartupInfo(app);
    createWindow();
  } else {
    Startup.printStartupErr(app);
    app.quit();
  }
});

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function() {
  if (BrowserWindow.getAllWindows().length == 0) createWindow();
});
