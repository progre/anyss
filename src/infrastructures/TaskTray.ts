import { app, Menu, Tray } from 'electron';

export default class TaskTray {
  // @ts-ignore
  private tray;

  constructor(params: {
    exportAllDevicesToClipboard(): void,
    openFolder(): void,
  }) {
    this.tray = new Tray(`${__dirname}/res/icon.png`);
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Export all devices to clipboard',
        click: params.exportAllDevicesToClipboard,
      },
      { type: 'separator' },
      {
        label: 'Open config folter...',
        click: params.openFolder,
      },
      { type: 'separator' },
      { label: 'Exit', click: () => { app.quit(); } },
    ]);
    this.tray.setContextMenu(contextMenu);
  }
}
