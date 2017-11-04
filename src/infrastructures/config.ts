import * as chokidar from 'chokidar';
import { app } from 'electron';
import * as fs from 'fs';
import { copy } from 'fs-extra';
import { Observable } from 'rxjs';
import * as stripJsonComments from 'strip-json-comments';

export interface Config {
  playKeys: ReadonlyArray<string>;
  outputWithDefault: boolean;
  outputDevice: string;
  modifierKey: string;
  sounds: { [key: string]: string; };
}

export async function prepareConfig() {
  await copy(
    `${__dirname}/res/config_default.json`,
    getPath(),
    { overwrite: false },
  );
}

export async function fetch() {
  return new Promise<Config>((resolve, reject) => {
    fs.readFile(
      getPath(),
      { encoding: 'utf8' },
      (err, data) => {
        if (err != null) {
          reject(err);
          return;
        }
        resolve(JSON.parse(stripJsonComments(data)));
      },
    );
  });
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
