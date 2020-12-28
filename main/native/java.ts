import * as path from "path";
import * as child_process from "child_process";
import getAppRoot from "../utils/appPath";

export function getJavaPath(appModule: Electron.App): string {
  if (!appModule.isPackaged) {
    return path.join(require.main.path, "..", "java", "bin", "java.exe");
  } else {
    return path.join(path.dirname(appModule.getPath("exe")), "java", "bin", "java.exe");
  }
}

export function runJar(javaPath: string, jarPath: string, argument?: string, errCallback?: (stderr: string) => void, outCallback?: (stdout: string) => void, quitCallback?: (exitcode: number | null) => void): void {
  const javaProcess = child_process.exec(`${javaPath} -jar -Xmx20M ${jarPath}` + (argument == undefined ? "" : ` ${argument}`), {
    env: process.env,
    cwd: getAppRoot()
  });
  javaProcess.stdout.on("data", data => outCallback(data));
  javaProcess.stderr.on("data", data => errCallback(data));
  javaProcess.on("exit", exitcode => quitCallback(exitcode));
}