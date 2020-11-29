import {ipcRenderer} from "electron";
import {tabNode} from './controls'
import zincProtocolHandler from './../protocol'

export default class TabMng {

    private static closeLocked: boolean = false;
    public static newTabButton: HTMLElement = null;
    public static closeTabButton: HTMLElement = null;

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

        this.addNewTabButton();
        this.addCloseTabButton(newtab);

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
                    if (tabNode.children.item(i).id !== 'newtab-btn')
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
            currentLoopTab.style.color = 'white';
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

    public static addNewTabButton(): void {
        if (document.getElementById('newtab-btn'))
            document.getElementById('newtab-btn').remove();
        const newTabButton: HTMLElement = document.createElement('button');
        newTabButton.id = 'newtab-btn';
        newTabButton.innerText = "+";
        newTabButton.title = "New tab";
        tabNode.appendChild(<Node>newTabButton);
        this.newTabButton = newTabButton;

        const self = this;
        this.newTabButton.addEventListener('click', function () {
            self.newTab(zincProtocolHandler('zinc://newtab'));
        })
    }

    public static addCloseTabButton(tab: HTMLElement): void {
        if (this.closeTabButton != null)
            document.getElementById('closetab-btn').remove();
        const closeTabButton: HTMLElement = document.createElement('button');
        closeTabButton.id = 'closetab-btn';
        closeTabButton.innerHTML = "<span>&times;</span>";
        closeTabButton.title = "Close tab"
        tab.appendChild(<Node>closeTabButton);
        this.closeTabButton = closeTabButton;
    }
}

ipcRenderer.on('tabmng-browser-titleupdated', function (event, args) {
})