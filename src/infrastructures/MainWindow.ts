import { app, BrowserWindow, ipcMain, WebContents } from 'electron';
import { Subject, Observable } from 'rxjs';
import {
  ExportAllDevicesToClipboardMessage,
  PlayMessage,
  SelectDeviceForLabelMessage,
  SetSrcMessage,
  StopMessage,
} from '../infrastructures/ipctypes';
import { Config } from './config';

export default class MainWindow {
  private win = createWindow();
  private hideTimer: NodeJS.Timer | null;

  ready = new Observable<void>((subscriber) => {
    ipcMain.on('ready', (event: { sender: WebContents }) => {
      if (this.win.webContents !== event.sender) {
        return;
      }
      subscriber.complete();
    });
  });

  showTimer() {
    if (this.hideTimer != null) {
      clearTimeout(this.hideTimer);
    }
    this.win.showInactive();
    this.hideTimer = <any>setTimeout(
      () => {
        this.hideTimer = null;
        this.win.hide();
      },
      3000,
    );
  }

  exportAllDevicesToClipboard() {
    const message: ExportAllDevicesToClipboardMessage = {
      type: 'exportAllDevicesToClipboard',
    };
    this.win.webContents.send('message', message);
  }

  selectDeviceForLabel(config: Config) {
    const selectDeviceForLabelMessage: SelectDeviceForLabelMessage = {
      type: 'selectDeviceForLabel',
      label: config.outputDevice,
      withDefault: config.outputWithDefault,
    };
    this.win.webContents.send('message', selectDeviceForLabelMessage);
  }

  play() {
    const message: PlayMessage = { type: 'play' };
    this.win.webContents.send('message', message);
  }

  stop() {
    const message: StopMessage = { type: 'stop' };
    this.win.webContents.send('message', message);
  }

  setSrc(fileName: string) {
    const message: SetSrcMessage = {
      fileName,
      type: 'setSrc',
      src: `file://${app.getPath('userData')}/${fileName}`,
    };
    this.win.webContents.send('message', message);
  }
}

function createWindow() {
  const win = new BrowserWindow({
    alwaysOnTop: true,
    frame: false,
    height: 32,
    resizable: false,
    show: false,
    skipTaskbar: true,
    transparent: true,
    width: 640,
    x: 0,
    y: 0,
  });
  win.loadURL(`file://${__dirname}/public/index.html`);
  return win;
}
