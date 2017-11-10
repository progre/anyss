import { app, Menu, Tray } from 'electron';
const getLocalIp = require('node-localip');

export default class TaskTray {
  // @ts-ignore
  private tray;

  constructor(
    port: number | null,
    private delegate: {
      exportAllDevicesToClipboard(): void,
      openFolder(): void,
    }) {
    this.tray = new Tray(`${__dirname}/res/icon.png`);
    this.updatePort(port).catch((e) => { console.error(e.stack || e); });
  }

  async updatePort(port: number | null) {
    this.tray.setContextMenu(await createMenu(port, this.delegate));
  }
}

async function createMenu(
  port: number | null,
  delegate: {
    exportAllDevicesToClipboard(): void,
    openFolder(): void,
  },
) {
  let ipList: string[] | null = null;
  if (port != null) {
    ipList = await new Promise<string[]>((resolve, reject) => {
      getLocalIp.list((err: Error, data: string[]) => {
        if (err != null) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
    // tslint:disable-next-line:no-http-string
    ipList = ipList.map(x => `http://${x}:${port}`);
  }
  return Menu.buildFromTemplate([
    {
      label: 'Remote controller',
      enabled: ipList != null,
      submenu: ipList == null ? undefined : ipList.map(ip => ({
        label: ip,
      })),
    },
    { type: 'separator' },
    {
      label: 'Export all devices to clipboard',
      click: delegate.exportAllDevicesToClipboard,
    },
    { type: 'separator' },
    {
      label: 'Open config folder...',
      click: delegate.openFolder,
    },
    { type: 'separator' },
    {
      label: 'Exit',
      click: () => { app.quit(); },
    },
  ]);
}
