import * as path from "path";
import * as child_process from "child_process";

export function getJavaPath(appModule: Electron.App): string {
    if (!appModule.isPackaged) {
        return path.join(require.main.path, '..', 'java', 'bin', 'java.exe');
    } else {
        return path.join(Electron.app.getPath('exe'), 'java');
    }
}

export function runJar(javaPath: string, jarPath: string, argument?: string, callback?: (stdout: string, stderr: string) => any): void {
    child_process.exec(`${javaPath} -jar ${jarPath} ${argument}`, {
        cwd: path.join(require.main.path, '..'),
        env: process.env,
    }, function (error, stdout, stderr) {
        callback(stdout, stderr);
    })
}