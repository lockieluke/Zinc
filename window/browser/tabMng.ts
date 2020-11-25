import {ipcRenderer} from "electron";
import {tabNode} from './controls'

export default class TabMng {

    private static closeLocked: boolean = false;

    public static newTab(url: string): void {
        this.resetTabStates();
        const totaltab: number = ipcRenderer.sendSync('tabmng-new', [url]);

        const newtab = document.createElement('div');
        newtab.className = 'tab';
        newtab.id = 'tab-' + (totaltab);
        const tabtitle = document.createElement('h6');
        tabtitle.innerText = "Loading...";
        tabtitle.id = 'tabtitle-' + (totaltab);
        newtab.appendChild(tabtitle);
        tabNode.appendChild(newtab);

        this.focusOnToTab(newtab.id);

        const self = this;
        newtab.addEventListener('click', function () {
            self.resetTabStates();
            self.focusOnToTab(newtab.id);
        })
    }

    public static closeTab(): void {
        this.closeLocked = true;
        const self = this;
        if (ipcRenderer.sendSync('tabmng-getinfo')[0] > 1) {
            const focusedtab = ipcRenderer.sendSync('tabmng-getinfo')[2];
            const closingTabDom = document.getElementById('tab-' + focusedtab);
            closingTabDom.style.animation = 'close-tab 0.3s forwards ease-out';
            closingTabDom.addEventListener('animationend', function () {
                ipcRenderer.send('tabmng-close', closingTabDom.id);
                closingTabDom.remove();
                for (let i = 0; i < tabNode.children.length; i++) {
                    tabNode.children.item(i).id = 'tab-' + i;

                }
                const elTab = document.getElementById('tab-' + (focusedtab - 1));
                if (elTab) {
                    self.focusOnToTab(elTab.id);
                } else {
                    self.focusOnToTab(closingTabDom.id);

                }
                self.closeLocked = false;
            })
        } else {
            ipcRenderer.sendSync('win-close');
            this.closeLocked = false;
        }
    }

    public static focusOnToTab(tabdomid: string): void {
        console.log("Focusing to tab " + tabdomid);
        ipcRenderer.send('tabmng-focus', parseInt(tabdomid.replace('tab-', '')));
        document.getElementById(tabdomid).style.color = 'lightblue';
    }

    public static resetTabStates(): void {
        for (let i = 0; i < tabNode.children.length; i++) {
            const currentLoopTab = <HTMLElement>tabNode.children.item(i);
            currentLoopTab.style.color = 'black';
        }
    }

    public static getCurrentBV(): Electron.BrowserView {
        return ipcRenderer.sendSync('tabmng-getcurrentbv');
    }

    public static getCurrentWin(): Electron.BrowserWindow {
        return ipcRenderer.sendSync('tabmng-getcurrentwin');
    }

    public static isCloseLocked(): boolean {
        return TabMng.closeLocked;
    }
}

ipcRenderer.on('tabmng-browser-titleupdated', function (event, args) {
})