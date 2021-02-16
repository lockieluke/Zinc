import { dialog } from 'electron';
import { getCurrentWindow } from '../browser/winCtrls';
import { currentBV } from '../browser/tabMng';
import * as path from 'path';

export async function saveAs() {
  const { canceled, filePath } = await dialog.showSaveDialog(
    getCurrentWindow(),
    {
      defaultPath: currentBV.webContents.getTitle(),
      filters: [
        { name: 'Webpage, Complete', extensions: ['html', 'htm'] },
        { name: 'Webpage, HTML Only', extensions: ['html', 'htm'] },
      ],
      title: 'Save As',
    },
  );

  if (canceled) return;

  currentBV.webContents.savePage(
    filePath,
    path.extname(filePath) === '.htm' ? 'HTMLOnly' : 'HTMLComplete',
  );
}
