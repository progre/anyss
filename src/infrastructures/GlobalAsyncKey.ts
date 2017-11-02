import { EventEmitter } from 'events';

const { getAsyncKeyState }
  = <{ getAsyncKeyState(key: number): boolean }>require('asynckeystate');

// https://msdn.microsoft.com/ja-jp/library/windows/desktop/dd375731(v=vs.85).aspx
const KEY_VK: { [key: string]: number } = {
  Alt: 0x12,
  KeyV: 0x56,
};

export default class GlobalAsyncKey {
  private timer: NodeJS.Timer;
  private eventEmitter = new EventEmitter();
  private status = new Map<string, boolean>();

  constructor(keys: ReadonlyArray<string>) {
    this.timer = setInterval(
      () => {
        const current
          = keys.map(key => ({ key, state: getAsyncKeyState(KEY_VK[key]) }));
        current
          .filter(x => !this.status.get(x.key) && x.state)
          .forEach((x) => {
            this.eventEmitter.emit(
              'keydown',
              {
                key: x.key,
              },
            );
          });
        current
          .filter(x => this.status.get(x.key) && !x.state)
          .forEach((x) => {
            this.eventEmitter.emit(
              'keyup',
              {
                key: x.key,
              },
            );
          });
      },
      100,
    );
  }

  close() {
    clearInterval(this.timer);
  }

  addEventListener(
    type: 'keyup' | 'keydown',
    listener: (this: Document, ev: KeyboardEvent) => any,
  ) {
    this.eventEmitter.addListener(type, listener);
  }

  removeEventListener(
    type: 'keyup' | 'keydown',
    listener: (this: Document, ev: KeyboardEvent) => any,
  ) {
    this.eventEmitter.removeListener(type, listener);
  }
}
