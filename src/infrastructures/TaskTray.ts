import { app, Menu, shell, Tray } from 'electron';

export default class TaskTray {
  // @ts-ignore
  private tray;

  constructor(exportAllDevicesToClipboard: () => void) {
    this.tray = createTray(exportAllDevicesToClipboard);
  }
}

function createTray(exportAllDevicesToClipboard: () => void) {
  const tray = new Tray(`${__dirname}/res/icon.png`);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Export all devices to clipboard',
      click: exportAllDevicesToClipboard,
    },
    {
      label: 'Open config folter',
      click: () => { shell.showItemInFolder(app.getPath('userData')); },
    },
    { type: 'separator' },
    { label: 'Quit', click: () => { app.quit(); } },
  ]);
  tray.setContextMenu(contextMenu);
  return tray;
}
