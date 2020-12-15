import {ipcRenderer} from 'electron';

export default function logToMain(message: string) {
	ipcRenderer.send('logger-print-main', message);
}