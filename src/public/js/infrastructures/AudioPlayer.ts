export default class AudioPlayer {
  private audio = new Audio();

  constructor() {
    this.audio.onload = () => {
      console.log('loaded');
    };
  }

  async selectDeviceForLabel(label: string) {
    const allDevices = await navigator.mediaDevices.enumerateDevices();
    const device: MediaDeviceInfo | null = allDevices
      .filter(x => x.kind === 'audiooutput')
      .filter(x => x.label === label)
    [0];
    if (device == null) {
      console.error('device not found');
      return;
    }
    (<any>this.audio).setSinkId(device.deviceId);
  }

  setSrc(src: string) {
    this.audio.src = src;
  }

  async play() {
    console.log('play');
    await this.audio.play();
  }
}
