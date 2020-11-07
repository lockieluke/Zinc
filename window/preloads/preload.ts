import {ipcRenderer} from "electron";

window.onload = function () {
    document.addEventListener('mousedown', function (event) {
        if (event.button == 2)
            ipcRenderer.send('ctxmenu');
    })
}