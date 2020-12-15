import {clipboard, Menu, MenuItem} from 'electron';
import addMenuItems from './batchMenuItems';
import TabWrapper from '../browser/tabWrapper';
import {saveAs} from './commonActions';

export default function getLinkActionsCTX(menu: Menu, params: Electron.ContextMenuParams) {
    addMenuItems(menu, [
        new MenuItem({
            label: 'Open link in new tab',
            click: function () {
                TabWrapper.newTab(params.linkURL);
            }
        }),
        new MenuItem({
            label: 'Open link in new window',
        }),
        new MenuItem({
            label: 'Save link as...',
            click: saveAs
        }),
        new MenuItem({
            label: 'Copy link',
            click: function () {
                clipboard.writeText(params.linkURL);
            }
        })
    ]);
}