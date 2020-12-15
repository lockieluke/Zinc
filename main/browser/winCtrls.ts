import {app, BrowserWindow, ipcMain} from 'electron';

let win: BrowserWindow = null;

export default function main(window: BrowserWindow) {
	const currentwin: BrowserWindow = window;
	win = currentwin;

	ipcMain.on('win-close', function () {
		currentwin.close();
		if (BrowserWindow.getAllWindows().length == 0 && process.platform !== 'darwin')
			app.quit();
	});

	ipcMain.on('win-max', function () {
		if (currentwin.isMaximized()) {
			currentwin.unmaximize();
		} else {
			currentwin.maximize();
		}
	});

	ipcMain.on('win-min', function () {
		currentwin.minimize();
	});
}

export function getCurrentWindow(): BrowserWindow {
	return win;
}