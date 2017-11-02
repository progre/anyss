import { ipcRenderer } from 'electron';
import { Message } from '../../../infrastructures/ipctypes';
import AudioPlayer from '../infrastructures/AudioPlayer';

export default class Application {
  private audioPlayer = new AudioPlayer();

  constructor() {
    ipcRenderer.on('message', (message: Message) => {
      switch (message.type) {
        case 'selectDeviceForLabel':
          this.audioPlayer.selectDeviceForLabel(message.label)
            .catch((e) => { console.error(e); });
          return;
        case 'setSrc':
          this.audioPlayer.setSrc(message.src);
          return;
        case 'play':
          this.audioPlayer.play().catch((e) => { console.error(e); });
          return;
        default:
          throw new Error();
      }
    });
  }
}
