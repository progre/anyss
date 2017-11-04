import { globalShortcut } from 'electron';
import {
  Config,
  fetch as fetchConfig,
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
      this.taskTray = new TaskTray(() => {
        this.win.exportAllDevicesToClipboard();
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
    const config = await fetchConfig();
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
