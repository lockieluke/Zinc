import { ipcRenderer } from 'electron';

export default function logFromBrowserFrame(message: string) {
  ipcRenderer.send('log-from-browser-frame', message);
}