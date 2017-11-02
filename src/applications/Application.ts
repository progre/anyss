import { globalShortcut, WebContents } from 'electron';
import { fetch as fetchConfig } from '../infrastructures/config';
import GlobalAsyncKey from '../infrastructures/GlobalAsyncKey';
import {
  PlayMessage,
  SelectDeviceForLabelMessage,
  SetSrcMessage,
  StopMessage,
} from '../infrastructures/ipctypes';

export default class Application {
  private globalAsyncKey: GlobalAsyncKey | null;

  constructor(
    private webContents: WebContents,
  ) {
  }

  release() {
    if (this.globalAsyncKey != null) {
      this.globalAsyncKey.close();
    }
  }

  async readConfig() {
    const config = await fetchConfig();
    const selectDeviceForLabelMessage: SelectDeviceForLabelMessage = {
      type: 'selectDeviceForLabel',
      label: config.outputDevice,
    };
    this.webContents.send('message', selectDeviceForLabelMessage);
    this.globalAsyncKey = new GlobalAsyncKey(config.playKeys);
    this.globalAsyncKey.addEventListener('keydown', (e) => {
      const message: PlayMessage = { type: 'play' };
      this.webContents.send('message', message);
    });
    this.globalAsyncKey.addEventListener('keyup', (e) => {
      const message: StopMessage = { type: 'stop' };
      this.webContents.send('message', message);
    });
    Object.keys(config.sounds).forEach((key) => {
      globalShortcut.register(`${config.soundCombinationKey}+${key}`, () => {
        const message: SetSrcMessage = {
          type: 'setSrc',
          src: `file://${__dirname}/../res/${config.sounds[key]}`,
        };
        this.webContents.send('message', message);
      });
    });
  }
}
