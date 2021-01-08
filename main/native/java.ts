import * as path from 'path';
import * as child_process from 'child_process';
import getAppRoot from '../utils/appPath';

export function getJavaPath(appModule: Electron.App): string {
  if (!appModule.isPackaged) {
    return path.join(getAppRoot(), 'java', 'bin', 'java.exe');
  } else {
    return path.join(path.dirname(appModule.getPath('exe')), 'java', 'bin', 'java.exe');
  }
}

export function runJar(javaPath: string, jarPath: string, appModule: Electron.App, argument?: string, errCallback?: (stderr: string) => void, outCallback?: (stdout: string) => void, quitCallback?: (exitcode: number | null) => void): void {
  const javaArgs: string[] = ['-jar', '-Xmx20M', jarPath];
  if (argument != undefined || argument != '')
    javaArgs.push(argument);

  const javaProcess = child_process.spawn(javaPath, javaArgs, {
    env: process.env,
    cwd: appModule.isPackaged ? path.dirname(appModule.getPath('exe')) : getAppRoot(),
  });
  javaProcess.stdout.on('data', data => outCallback(data));
  javaProcess.stderr.on("data", data => errCallback(data));
  javaProcess.on("exit", exitcode => quitCallback(exitcode));
}