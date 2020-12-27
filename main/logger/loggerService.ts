import { ipcMain } from "electron";
import { defaultLogger } from "./logger";
import { LogLevel, LogTypes } from "./logTypes";

export default function initLoggerService() {
  ipcMain.on("log-from-browser-frame", function(event, args: string) {
    defaultLogger(LogTypes.BrowserFrameProcess, args, LogLevel.Log);
  });
}