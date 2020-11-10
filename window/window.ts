import {TabMng} from './browser/tabMng'
import {newTabBtn, closeTabBtn} from './browser/controls'
import zincProtocolHandler from './protocol'
import initWinControls from './browser/winCtrls'
import initTitleManager from './browser/titleManager'
import initBackForwardManager from './browser/backForwardManager'

window.onload = function () {
    initWinControls();
    initTitleManager();
    initBackForwardManager();

    newTabBtn.addEventListener('click', function () {
        TabMng.newTab(zincProtocolHandler('zinc://newtab'));
    })

    closeTabBtn.addEventListener('click', function () {
        if (!TabMng.closeLocked) {
            TabMng.closeTab();
        }
    })

    TabMng.newTab(zincProtocolHandler('zinc://newtab'));
}