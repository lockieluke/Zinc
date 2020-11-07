"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabMng = void 0;
const electron_1 = require("electron");
const controls_1 = require("./controls");
class TabMng {
    static newTab(url) {
        this.resetTabStates();
        const totaltab = electron_1.ipcRenderer.sendSync('tabmng-new', [url]);
        const newtab = document.createElement('div');
        newtab.className = 'tab';
        newtab.id = 'tab-' + (totaltab);
        const tabtitle = document.createElement('h6');
        tabtitle.innerText = "Loading...";
        tabtitle.id = 'tabtitle-' + (totaltab);
        newtab.appendChild(tabtitle);
        controls_1.tabNode.appendChild(newtab);
        this.focusOnToTab(newtab.id);
        const self = this;
        newtab.addEventListener('click', function () {
            self.resetTabStates();
            self.focusOnToTab(newtab.id);
        });
    }
    static closeTab() {
        this.closeLocked = true;
        const self = this;
        if (electron_1.ipcRenderer.sendSync('tabmng-getinfo')[0] > 1) {
            const focusedtab = electron_1.ipcRenderer.sendSync('tabmng-getinfo')[2];
            const closingTabDom = document.getElementById('tab-' + focusedtab);
            closingTabDom.style.animation = 'close-tab 0.3s forwards ease-out';
            closingTabDom.addEventListener('animationend', function () {
                closingTabDom.remove();
                for (let i = 0; i < controls_1.tabNode.children.length; i++) {
                    controls_1.tabNode.children.item(i).id = 'tab-' + i;
                }
                const elTab = document.getElementById('tab-' + (focusedtab - 1));
                if (elTab) {
                    self.focusOnToTab(elTab.id);
                }
                else {
                    self.focusOnToTab(closingTabDom.id);
                }
                electron_1.ipcRenderer.send('tabmng-close', closingTabDom.id);
                self.closeLocked = false;
            });
        }
        else {
            electron_1.ipcRenderer.sendSync('win-close');
            this.closeLocked = false;
        }
    }
    static focusOnToTab(tabdomid) {
        electron_1.ipcRenderer.send('tabmng-focus', parseInt(tabdomid.replace('tab-', '')));
        document.getElementById(tabdomid).style.color = 'lightblue';
    }
    static resetTabStates() {
        for (let i = 0; i < controls_1.tabNode.children.length; i++) {
            const currentLoopTab = controls_1.tabNode.children.item(i);
            currentLoopTab.style.color = 'black';
        }
    }
}
exports.TabMng = TabMng;
TabMng.closeLocked = false;
electron_1.ipcRenderer.on('tabmng-browser-titleupdated', function (event, args) {
});
//# sourceMappingURL=tabMng.js.map