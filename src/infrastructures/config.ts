import * as fs from 'fs';
import * as stripJsonComments from 'strip-json-comments';

export async function fetch() {
  type Config = {
    playKeys: ReadonlyArray<string>;
    outputWithDefault: boolean;
    outputDevice: string;
    modifierKey: string;
    sounds: { [key: string]: string; }
  };
  return new Promise<Config>((resolve, reject) => {
    fs.readFile(`${__dirname}/../res/config.json`, { encoding: 'utf8' }, (err, data) => {
      if (err != null) {
        reject(err);
        return;
      }
      resolve(JSON.parse(stripJsonComments(data)));
    });
  });
}
