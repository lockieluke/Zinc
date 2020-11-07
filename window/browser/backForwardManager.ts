import {ipcRenderer} from "electron";
import {titleBarCtrls} from "./controls";

export default function main() {
    ipcRenderer.on('tabmng-browser-backforward', function (event, args) {
        const backBtnHTML = '<span>&leftarrow;</span>';
        const forwardBtnHTML = '<span>&rightarrow;</span>';

        try {
            document.getElementById('backBtn').remove();
        } catch {}

        try {
            document.getElementById('forwardBtn').remove();
        } catch {}

        const backbtn = document.createElement('div');
        backbtn.id = 'backBtn';
        backbtn.className = 'titlebarbtns';
        backbtn.title = 'Back';
        backbtn.innerHTML = backBtnHTML;

        const forwardbtn = document.createElement('div');
        forwardbtn.id = 'forwardBtn';
        forwardbtn.className = 'titlebarbtns';
        forwardbtn.title = 'Forward';
        forwardbtn.innerHTML = forwardBtnHTML;

        if (args[0]) {
            titleBarCtrls.appendChild(backbtn);
        }

        if (args[1]) {
            titleBarCtrls.appendChild(forwardbtn);
        }

        backbtn.addEventListener('click', function () {
            ipcRenderer.send('tabmng-back');
        })

        forwardbtn.addEventListener('click', function () {
            ipcRenderer.send('tabmng-forward');
        })
    })
}