import { ipcRenderer } from 'electron';
import { winCloseBtn, winMaxBtn, winMinBtn } from './controls';

export default function main() {
  winCloseBtn.addEventListener('click', function() {
    ipcRenderer.send('win-close');
  });

  winMaxBtn.addEventListener('click', function() {
    ipcRenderer.send('win-max');
  });

  winMinBtn.addEventListener('click', function () {
    ipcRenderer.send('win-min');
  });
}
