import TabMng from './browser/tabMng'
import {closeTabBtn, newTabBtn} from './browser/controls'
import zincProtocolHandler from './protocol'
import initWinControls from './browser/winCtrls'
import initTitleManager from './browser/titleManager'
import initBackForwardManager from './browser/backForwardManager'
import initMouseEvent from './browser/mouseEvent'
import initTabWrapperService from './browser/tabWrapper'

window.onload = function () {
    initWinControls();
    initTitleManager();
    initBackForwardManager();
    initMouseEvent();
    initTabWrapperService();

    newTabBtn.addEventListener('click', function () {
        TabMng.newTab(zincProtocolHandler('zinc://newtab'));
    })

    closeTabBtn.addEventListener('click', function () {
        if (!TabMng.isCloseLocked()) {
            TabMng.closeTab();
        }
    })

    TabMng.newTab(zincProtocolHandler('zinc://newtab'));
}