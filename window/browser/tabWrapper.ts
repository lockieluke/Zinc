import { ipcRenderer } from 'electron';
import TabMng from './tabMng';

export default function main() {
  ipcRenderer.on('tabwrapper-newtab', function(event, args) {
    TabMng.newTab(args);
  });

  ipcRenderer.on('tabwrapper-closetab', function() {
    if (!TabMng.isCloseLocked())
      TabMng.closeTab();
  });
}
