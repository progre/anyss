import { app } from 'electron';
import * as fs from 'fs';
import { copy } from 'fs-extra';
import * as stripJsonComments from 'strip-json-comments';

export async function prepareConfig() {
  await copy(
    `${__dirname}/res/config_default.json`,
    `${app.getPath('userData')}/config.json`,
    { overwrite: false },
  );
}

export async function fetch() {
  type Config = {
    playKeys: ReadonlyArray<string>;
    outputWithDefault: boolean;
    outputDevice: string;
    modifierKey: string;
    sounds: { [key: string]: string; }
  };
  return new Promise<Config>((resolve, reject) => {
    fs.readFile(
      `${app.getPath('userData')}/config.json`,
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
