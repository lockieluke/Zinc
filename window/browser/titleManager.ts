import {ipcRenderer} from 'electron';

export default function main() {
	ipcRenderer.on('tabmng-browser-titleupdated', function (event, args) {
		document.getElementById(args[0].replace('tab', 'tabtitle')).innerText = args[1];
	});
}