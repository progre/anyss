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
  private remoteController: RemoteController;

  constructor() {
    this.win.ready.subscribe(() => {
      this.taskTray = new TaskTray(
        null,
        {
          openFolder,
          exportAllDevicesToClipboard: () => {
            this.win.exportAllDevicesToClipboard();
          },
        },
      );
      (async () => {
        await prepareConfig();
        startConfigWatch().subscribe(() => {
          (async () => {
            await this.readConfig();
            await this.taskTray.updatePort(this.config!.remoteControllerPort!);
            this.initRemoteController();
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

  private initRemoteController() {
    if (!isValidTCPPort(this.config!.remoteControllerPort)) {
      return;
    }
    if (this.remoteController != null) {
      if (this.config!.remoteControllerPort === this.remoteController.port) {
        return;
      }
      this.remoteController.close();
    }
    this.remoteController = new RemoteController(
      this.config!.remoteControllerPort!,
      {
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

function isValidTCPPort(num: number | undefined) {
  return num != null && 0 < num && num <= 65535;
}
