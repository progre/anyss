import { app, BrowserWindow, dialog, globalShortcut, shell } from 'electron';
import {
  Config,
  fetch as fetchConfig,
  openFolder,
  prepareConfig,
  startConfigWatch,
} from '../infrastructures/config';
import GlobalAsyncKey from '../infrastructures/GlobalAsyncKey';
import MainWindow from '../infrastructures/MainWindow';
import TaskTray from '../infrastructures/TaskTray';

export default class Application {
  private globalAsyncKey: GlobalAsyncKey | null;
  // @ts-ignore
  private taskTray: TaskTray;
  private win = new MainWindow();

  constructor() {
    this.win.ready.subscribe(() => {
      this.taskTray = new TaskTray({
        openFolder,
        exportAllDevicesToClipboard: () => {
          this.win.exportAllDevicesToClipboard();
        },
      });
      (async () => {
        await prepareConfig();
        startConfigWatch().subscribe(() => {
          this.readConfig().catch((e) => { console.error(e); });
        });
      })().catch((e) => { console.error(e); });
    });
  }

  private async readConfig() {
    let config;
    try {
      config = await fetchConfig();
    } catch (e) {
      showConfigErrorDialog(e);
      return;
    }
    this.win.selectDeviceForLabel(config);
    this.initGlobalAsyncKey(config);
    this.initGlobalShortcut(config);
  }

  private initGlobalAsyncKey(config: Config) {
    if (this.globalAsyncKey != null) {
      this.globalAsyncKey.close();
    }
    this.globalAsyncKey = new GlobalAsyncKey(config.playKeys);
    this.globalAsyncKey.addEventListener('keydown', () => { this.win.play(); });
    this.globalAsyncKey.addEventListener('keyup', () => { this.win.stop(); });
  }

  private initGlobalShortcut(config: Config) {
    globalShortcut.unregisterAll();
    Object.keys(config.sounds).forEach((key) => {
      globalShortcut.register(`${config.modifierKey}+${key}`, () => {
        this.win.setSrc(config.sounds[key]);
        this.win.showTimer();
      });
    });
  }
}

function showConfigErrorDialog(e: Error) {
  dialog.showMessageBox(
    <any>{
      type: 'error',
      title: 'micspam',
      message: `Failed to read config.json:\n  ${e.message}`,
      buttons: ['Open config folder', 'Close'],
    },
    (num) => {
      if (num !== 0) {
        return;
      }
      openFolder();
    },
  );
}
