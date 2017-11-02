import * as fs from 'fs';
import { promisify } from 'util';
const readFile = promisify(fs.readFile);

export async function fetch() {
  return <{
    playKeys: ReadonlyArray<string>;
    outputDevice: string;
    soundCombinationKey: string;
    sounds: { [key: string]: string; }
  }>
    JSON.parse(
      await readFile(`${__dirname}/../res/config.json`, { encoding: 'utf8' }),
    );
}
