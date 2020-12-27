import { ipcRenderer } from "electron";
import { tabNode } from "./controls";
import zincProtocolHandler from "./../protocol";
import logFromBrowserFrame from "./logger";

export default class TabMng {
  private static closeLocked = false;
  public static newTabButton: HTMLElement = null;
  public static closeTabButton: HTMLElement = null;
  private static focusedTab: HTMLElement = document.getElementById(
    'tab-' + ipcRenderer.sendSync('tabmng-getinfo')[2],
  );
  private static currentURLBar: HTMLElement = null;
  private static readyForNextUBarAnimation = true;

  public static newTab(url: string): void {
    this.resetTabStates();
    const newtab = document.createElement('div');
    newtab.className = 'tab';
    const totaltab: number = parseInt(
      ipcRenderer.sendSync('tabmng-getinfo')[0],
    );
    newtab.id = 'tab-' + totaltab;
    ipcRenderer.send('tabmng-new', [url, newtab.id]);
    const tabtitle = document.createElement('h6');
    tabtitle.innerText = 'Loading...';
    tabtitle.id = 'tabtitle-' + totaltab;
    newtab.appendChild(tabtitle);
    tabNode.appendChild(newtab);

    this.focusOnToTab(newtab.id);

    this.addNewTabButton();

    const self = this;
    newtab.addEventListener('click', function () {
      self.resetTabStates();
      self.focusOnToTab(newtab.id);
    });

    newtab.addEventListener('dblclick', function (event) {
      if (self.readyForNextUBarAnimation) {
        if (self.currentURLBar == null) {
          newtab.style.animation = 'url-tab 0.3s forwards ease-out';
          self.currentURLBar = newtab;
        } else {
          newtab.style.animation = 'url-tab-re 0.3s forwards ease-out';
          self.currentURLBar = null;
        }
      }
    });
  }

  public static closeTab(): void {
    this.closeLocked = true;
    const self = this;
    if (ipcRenderer.sendSync('tabmng-getinfo')[0] > 1) {
      this.closeTabButton.remove();
      const focusedtab = ipcRenderer.sendSync('tabmng-getinfo')[2];
      const closingTabDom = document.getElementById('tab-' + focusedtab);
      closingTabDom.style.animation = 'close-tab 0.3s forwards ease-out';
      closingTabDom.addEventListener('animationend', function () {
        ipcRenderer.send('tabmng-close', closingTabDom.id);
        closingTabDom.remove();
        for (let i = 0; i < tabNode.children.length; i++) {
          if (tabNode.children.item(i).id !== 'newtab-btn') {
            tabNode.children.item(i).id = 'tab-' + i;
            tabNode.children.item(i).children.item(i).id = 'tabtitle-' + i;
          }
        }
        const elTab = document.getElementById('tab-' + (focusedtab - 1));
        if (elTab) {
          self.focusOnToTab(elTab.id);
        } else {
          self.focusOnToTab(closingTabDom.id);
        }
        self.addCloseTabButton();
        self.closeLocked = false;
      });
    } else {
      ipcRenderer.sendSync('win-close');
      this.closeLocked = false;
    }
  }

  public static focusOnToTab(tabdomid: string): void {
    logFromBrowserFrame(`Focusing to tab ${tabdomid}`);
    ipcRenderer.send("tabmng-focus", parseInt(tabdomid.replace("tab-", "")));
    document.getElementById(tabdomid).style.color = 'lightblue';
    this.focusedTab = document.getElementById(tabdomid);
    this.addCloseTabButton();
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
    if (this.newTabButton != null) this.newTabButton.remove();
    const newTabButton: HTMLElement = document.createElement('button');
    newTabButton.id = 'newtab-btn';
    newTabButton.innerText = '+';
    newTabButton.title = 'New tab';
    tabNode.appendChild(<Node>newTabButton);
    this.newTabButton = newTabButton;

    const self = this;
    this.newTabButton.addEventListener('click', function () {
      self.newTab(zincProtocolHandler('zinc://newtab'));
    });
  }

  public static addCloseTabButton(): void {
    if (this.closeTabButton != null) this.closeTabButton.remove();
    const closeTabButton: HTMLElement = document.createElement('button');
    closeTabButton.id = 'closetab-btn';
    closeTabButton.innerHTML = '<span>&times;</span>';
    closeTabButton.title = 'Close tab';
    this.focusedTab.appendChild(<Node>closeTabButton);
    this.closeTabButton = closeTabButton;

    const self = this;
    this.closeTabButton.addEventListener('click', function () {
      if (!self.isCloseLocked())
        self.closeTab();
    });
  }
}

ipcRenderer.on('tabmng-browser-titleupdated', function (event, args) {});
