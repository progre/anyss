export default class AudioPlayer {
  private defaultAudio: HTMLAudioElement | null;
  private audio = new Audio();

  setWithDefault(value: boolean) {
    if (!value && this.defaultAudio != null) {
      this.defaultAudio = null;
      return;
    }
    if (value && this.defaultAudio == null) {
      this.defaultAudio = new Audio();
      return;
    }
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
    if (this.defaultAudio != null) {
      this.defaultAudio.src = src;
    }
  }

  async play() {
    await Promise.all([
      this.audio.play(),
      this.defaultAudio == null ? Promise.resolve() : this.defaultAudio.play(),
    ]);
  }

  async stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    if (this.defaultAudio != null) {
      this.defaultAudio.pause();
      this.defaultAudio.currentTime = 0;
    }
  }
}
