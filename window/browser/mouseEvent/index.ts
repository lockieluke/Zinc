import {ipcRenderer} from "electron";

export default function main() {
    window.addEventListener('mousemove', function (event) {
        ipcRenderer.send('send-mouse-pos', [event.pageX, event.pageY]);
    })
}