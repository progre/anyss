const copyToClipboard = require('copy-to-clipboard');
import { ipcRenderer } from 'electron';
import { Message } from '../../../infrastructures/ipctypes';
import AudioPlayer from '../infrastructures/AudioPlayer';

export default class Application {
  private audioPlayer = new AudioPlayer();

  constructor() {
    ipcRenderer.on('message', (event: any, message: Message) => {
      switch (message.type) {
        case 'exportAllDevicesToClipboard':
          exportAllDevicesToClipboard()
            .catch((e) => { console.error(e.stack || e); });
          return;
        case 'selectDeviceForLabel':
          this.audioPlayer.setWithDefault(message.withDefault);
          this.audioPlayer.selectDeviceForLabel(message.label)
            .catch((e) => { console.error(e); });
          return;
        case 'setSrc':
          this.audioPlayer.setSrc(message.src);
          document.getElementById('fileName')!.innerText = message.fileName;
          return;
        case 'play':
          this.audioPlayer.play().catch((e) => { console.error(e); });
          return;
        case 'stop':
          this.audioPlayer.stop().catch((e) => { console.error(e); });
          return;
        default:
          throw new Error(JSON.stringify(message));
      }
    });
    ipcRenderer.send('ready');
  }
}

async function exportAllDevicesToClipboard() {
  const allDevices = await navigator.mediaDevices.enumerateDevices();
  copyToClipboard(
    allDevices
      .filter(x => x.kind === 'audiooutput')
      .map(x => x.label)
      .join('\n'),
  );
}
