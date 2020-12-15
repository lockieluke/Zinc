import {ipcMain} from 'electron';

export default function main() {
	ipcMain.on('logger-print-main', function (event, args) {
		console.log(args);
	});
}