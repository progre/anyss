import { BrowserWindow, globalShortcut, ipcMain, WebContents } from 'electron';
import { fetch as fetchConfig } from '../infrastructures/config';
import GlobalAsyncKey from '../infrastructures/GlobalAsyncKey';
import {
  ExportAllDevicesToClipboardMessage,
  PlayMessage,
  SelectDeviceForLabelMessage,
  SetSrcMessage,
  StopMessage,
} from '../infrastructures/ipctypes';
import TaskTray from '../infrastructures/TaskTray';

export default class Application {
  private globalAsyncKey: GlobalAsyncKey | null;
  private windowHideTimer: NodeJS.Timer;
  // @ts-ignore
  private taskTray: TaskTray;

  constructor(
    private win: BrowserWindow,
  ) {
    ipcMain.on('ready', (event: { sender: WebContents }) => {
      this.taskTray = new TaskTray(() => {
        const message: ExportAllDevicesToClipboardMessage = {
          type: 'exportAllDevicesToClipboard',
        };
        event.sender.send('message', message);
      });
      this.readConfig(event.sender).catch((e) => { console.error(e); });
    });
  }

  release() {
    if (this.globalAsyncKey != null) {
      this.globalAsyncKey.close();
    }
  }

  async readConfig(webContents: WebContents) {
    const config = await fetchConfig();
    const selectDeviceForLabelMessage: SelectDeviceForLabelMessage = {
      type: 'selectDeviceForLabel',
      label: config.outputDevice,
      withDefault: config.outputWithDefault,
    };
    webContents.send('message', selectDeviceForLabelMessage);
    this.globalAsyncKey = new GlobalAsyncKey(config.playKeys);
    this.globalAsyncKey.addEventListener('keydown', (e) => {
      const message: PlayMessage = { type: 'play' };
      webContents.send('message', message);
    });
    this.globalAsyncKey.addEventListener('keyup', (e) => {
      const message: StopMessage = { type: 'stop' };
      webContents.send('message', message);
    });
    Object.keys(config.sounds).forEach((key) => {
      globalShortcut.register(`${config.modifierKey}+${key}`, () => {
        const message: SetSrcMessage = {
          type: 'setSrc',
          src: `file://${__dirname}/../res/${config.sounds[key]}`,
          fileName: config.sounds[key],
        };
        webContents.send('message', message);
        this.showWindow();
      });
    });
  }

  private showWindow() {
    if (this.windowHideTimer != null) {
      clearTimeout(this.windowHideTimer);
    }
    this.win.showInactive();
    this.windowHideTimer = <any>setTimeout(
      () => {
        this.win.hide();
      },
      3000,
    );
  }
}
