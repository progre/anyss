import { dialog, globalShortcut } from 'electron';
import {
  Config,
  fetch as fetchConfig,
  openFolder,
  prepareConfig,
  startConfigWatch,
} from '../infrastructures/config';
import GlobalAsyncKey from '../infrastructures/GlobalAsyncKey';
import MainWindow from '../infrastructures/MainWindow';
import RemoteController from '../infrastructures/RemoteController';
import TaskTray from '../infrastructures/TaskTray';

export default class Application {
  private config: Config | null;
  private globalAsyncKey: GlobalAsyncKey | null;
  // @ts-ignore
  private taskTray: TaskTray;
  private win = new MainWindow();
  // @ts-ignore
  private remoteController: RemoteController;

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
          (async () => {
            await this.readConfig();
            // tslint:disable-next-line:no-var-self
            this.remoteController = new RemoteController({
              getSounds: () => {
                return this.config!.sounds.map(x => ({
                  fileName: x.fileName,
                  tags: (
                    x.tags == null || x.tags.length === 0
                      ? ['default']
                      : x.tags
                  ),
                }));
              },
              setSrc: (fileName: string) => {
                this.win.setSrc(fileName);
              },
            });
          })().catch((e) => { console.error(e); });
        });
      })().catch((e) => { console.error(e); });
    });
  }

  private async readConfig() {
    try {
      this.config = await fetchConfig();
    } catch (e) {
      showConfigErrorDialog(e);
      return;
    }
    this.win.selectDeviceForLabel(this.config);
    this.initGlobalAsyncKey(this.config);
    this.initGlobalShortcut(this.config);
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
    if (config.modifierKey == null || config.modifierKey.length === 0) {
      return;
    }
    config.sounds
      .filter(x => x.combinationKey != null)
      .forEach((sound) => {
        globalShortcut.register(`${config.modifierKey!}+${sound.combinationKey!}`, () => {
          this.win.setSrc(sound.fileName);
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
