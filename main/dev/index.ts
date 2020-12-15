import electronLocalKeystroke from '../keystrokes';

export default function main(window: Electron.BrowserWindow) {
	electronLocalKeystroke.registerLocalKeyStroke('CommandOrControl+Shift+R', window, function () {
		window.reload();
	});
}