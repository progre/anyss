import { EventEmitter } from 'events';
import { KEY_VK } from './keyvk';

const { getAsyncKeyState }
  = <{ getAsyncKeyState(key: number): boolean }>require('asynckeystate');

export default class GlobalAsyncKey {
  private timer: NodeJS.Timer;
  private eventEmitter = new EventEmitter();
  private status = new Map<string, boolean>();

  constructor(keys: ReadonlyArray<string>) {
    this.timer = <any>setInterval(
      () => {
        const current
          = keys.map(key => ({ key, state: getAsyncKeyState(KEY_VK[key]) }));
        current
          .filter(x => !this.status.get(x.key) && x.state)
          .forEach((x) => {
            this.status.set(x.key, x.state);
            this.eventEmitter.emit(
              'keydown',
              {
                code: x.key,
              },
            );
          });
        current
          .filter(x => this.status.get(x.key) && !x.state)
          .forEach((x) => {
            this.status.set(x.key, x.state);
            this.eventEmitter.emit(
              'keyup',
              {
                code: x.key,
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
