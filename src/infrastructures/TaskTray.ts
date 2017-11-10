// tslint:disable-next-line:variable-name
const Datauri = require('datauri');
import { app, BrowserWindow, Menu, Tray } from 'electron';
const getLocalIp = require('node-localip');
import * as qr from 'qr-image';

const ICON_PATH = `${__dirname}/res/icon.png`;

export default class TaskTray {
  // @ts-ignore
  private tray;

  constructor(
    port: number | null,
    private delegate: {
      exportAllDevicesToClipboard(): void,
      openFolder(): void,
    }) {
    this.tray = new Tray(ICON_PATH);
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
  let urls;
  if (port != null) {
    const ipList = await new Promise<string[]>((resolve, reject) => {
      getLocalIp.list((err: Error, data: string[]) => {
        if (err != null) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
    // tslint:disable-next-line:no-http-string
    urls = ipList.map(x => `http://${x}:${port}`);
  }
  return Menu.buildFromTemplate([
    {
      label: 'Remote controller',
      enabled: urls != null,
      submenu: urls == null ? undefined : urls.map(url => ({
        label: `${url} ...`,
        click() { openQRCodeWindow(url); },
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
      click() { app.quit(); },
    },
  ]);
}

function openQRCodeWindow(url: string) {
  const datauri = new Datauri();
  datauri.format('.png', <Buffer>qr.imageSync(url, { type: 'png' }));
  const win = new BrowserWindow({
    alwaysOnTop: true,
    height: 300,
    icon: ICON_PATH,
    minimizable: false,
    maximizable: false,
    resizable: false,
    skipTaskbar: true,
    title: `${url} - anyss`,
    width: 300,
  });
  win.addListener('page-title-updated', (e) => {
    e.preventDefault();
  });
  win.loadURL(datauri.content);
}
