import * as chokidar from 'chokidar';
import { app, shell } from 'electron';
import * as fs from 'fs';
import { copy } from 'fs-extra';
import { Observable } from 'rxjs';
import * as stripJsonComments from 'strip-json-comments';

export interface Config {
  readonly playKeys: ReadonlyArray<string>;
  readonly outputWithDefault: boolean;
  readonly outputDevice: string;
  readonly modifierKey?: string;
  readonly sounds: ReadonlyArray<{
    readonly fileName: string;
    readonly combinationKey?: string;
    readonly tags?: ReadonlyArray<string>;
  }>;
}

export function openFolder() {
  shell.showItemInFolder(`${app.getPath('userData')}/*`);
}

export async function prepareConfig() {
  await copy(
    `${__dirname}/res/config_template.json`,
    getPath(),
    { overwrite: false },
  );
}

export async function fetch() {
  const text = await new Promise<string>((resolve, reject) => {
    fs.readFile(
      getPath(),
      { encoding: 'utf8' },
      (err, data) => {
        if (err != null) {
          reject(err);
          return;
        }
        resolve(data);
      },
    );
  });
  return <Config>JSON.parse(stripJsonComments(text));
}

export function startConfigWatch() {
  return new Observable((subscriber) => {
    chokidar.watch(getPath()).on('all', (event, path) => {
      subscriber.next();
    });
  });
}

function getPath() {
  return `${app.getPath('userData')}/config.json`;
}
