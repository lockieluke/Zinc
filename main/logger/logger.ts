import { LogLevel, LogTypes } from "./";

export function defaultLogger(logType: LogTypes, message: string, logLevel: LogLevel = LogLevel.Info, electronApp?: Electron.App) {
  let compositionMsg: string = "[";
  switch (logType) {
    case LogTypes.MainProcess:
      compositionMsg += "Main Process";
      break;
    case LogTypes.WindowProcess:
      compositionMsg += "Window Process";
      break;
    case LogTypes.BrowserFrameProcess:
      compositionMsg += "Browser Frame Process";
      break;
    case LogTypes.Common:
      compositionMsg += "Common";
      break;
    case LogTypes.ZincNative:
      compositionMsg += "Zinc Native";
      break;
    case LogTypes.Debugging:
      compositionMsg += "Debugging";
      break;
    case LogTypes.NodeJS:
      compositionMsg += "NodeJS";
      break;
  }
  compositionMsg += `] ${message}`;
  logLevelTranslator(logLevel, compositionMsg);
}

function logLevelTranslator(logLevel: LogLevel, message: string, electronApp?: Electron.App) {
  switch (logLevel) {
    case LogLevel.Log:
      console.log(message);
      break;
    case LogLevel.Warning:
      console.warn(message);
      break;
    case LogLevel.Error:
      console.error(message);
      break;
    case LogLevel.Info:
      console.info(message);
      break;
    case LogLevel.Debug:
      console.debug(message);
      break;

    case LogLevel.DevLog:
      if (electronApp != undefined)
        if (!electronApp.isPackaged)
          console.log(message);
      break;
  }
}