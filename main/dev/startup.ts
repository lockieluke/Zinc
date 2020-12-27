import * as fs from "fs";
import getAppRoot from "../utils/appPath";
import * as path from "path";
import defaultLogger, { LogLevel, LogTypes } from "../logger";

export default class Startup {

  private static developerName: string = require(path.join(getAppRoot(), "devLicense.json")).name;
  private static gitRepo: string = require(path.join(getAppRoot(), "devLicense.json")).gitRepo;
  private static startupTime: Date = new Date();

  public static printStartupInfo(electronApp: Electron.App) {
    if (!electronApp.isPackaged) {
      console.log("\n");
      defaultLogger(LogTypes.Debugging, `Zinc Development Build (${this.startupTime.toString()})`);
      defaultLogger(LogTypes.Debugging, `Forked build by ${this.developerName}`);
      defaultLogger(LogTypes.Debugging, `Developer Git Repository ${this.gitRepo}\n`);
    }
  }

  public static printStartupErr(electronApp: Electron.App) {
    if (!electronApp.isPackaged)
      defaultLogger(LogTypes.Debugging, "Zinc Development Build cannot be started since no development license is setup", LogLevel.Error);
  }

  public static canStartup(electronApp: Electron.App): boolean {
    return fs.existsSync(path.join(getAppRoot(), "devLicense.json")) && this.developerName != undefined && this.gitRepo != undefined || electronApp.isPackaged;
  }
}