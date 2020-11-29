import TabMng from './browser/tabMng'
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

    TabMng.newTab(zincProtocolHandler('zinc://newtab'));
}