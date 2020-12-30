import * as fs from 'fs';
import getAppRoot from '../utils/appPath';
import * as path from 'path';
import defaultLogger, { LogLevel, LogTypes } from '../logger';
import * as os from 'os';

export default class Startup {

  private static developerName: string = fs.existsSync(path.join(getAppRoot(), 'devLicense.json')) ? require(path.join(getAppRoot(), 'devLicense.json')).name : undefined;
  private static gitRepo: string = fs.existsSync(path.join(getAppRoot(), 'devLicense.json')) ? require(path.join(getAppRoot(), 'devLicense.json')).gitRepo : undefined;
  private static startupTime: Date = new Date();

  public static printStartupInfo(appModule: Electron.App): void {
    if (!appModule.isPackaged) {
      console.log('\n');
      defaultLogger(LogTypes.Debugging, `Zinc Development Build (${this.startupTime.toString()})`);
      defaultLogger(LogTypes.Debugging, `Forked build by ${this.developerName}`);
      defaultLogger(LogTypes.Debugging, `Developer Git Repository ${this.gitRepo}\n`);
      defaultLogger(LogTypes.Debugging, `System Information ${os.cpus()[0].model} with architecture ${os.arch()}, RAM ${os.totalmem() / 1024 / 1024 / 1024} GB`);
    }
  }

  public static printStartupErr(appModule: Electron.App): void {
    if (!appModule.isPackaged)
      defaultLogger(LogTypes.Debugging, 'Zinc Development Build cannot be started since no development license is setup', LogLevel.Error);
  }

  public static canStartup(appModule: Electron.App): boolean {
    return fs.existsSync(path.join(getAppRoot(), 'devLicense.json')) && this.developerName != undefined && this.gitRepo != undefined || appModule.isPackaged;
  }
}