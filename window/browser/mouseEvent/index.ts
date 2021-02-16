import { ipcRenderer } from 'electron';

export default function main() {
  document.addEventListener('mousemove', function (event) {
    ipcRenderer.send('send-mouse-pos', [event.pageX, event.pageY]);
  });
}
