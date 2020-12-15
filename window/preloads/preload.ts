import {ipcRenderer} from 'electron';

window.addEventListener('mousemove', function (event) {
	ipcRenderer.send('send-mouse-pos', [event.pageX, event.pageY]);
});