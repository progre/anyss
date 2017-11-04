try { require('source-map-support').install(); } catch (e) { /* NOP */ }
import { app } from 'electron';
import Application from './applications/Application';

async function main() {
  await new Promise((resolve, reject) => app.once('ready', resolve));
  app.on('window-all-closed', app.quit.bind(app));
  // tslint:disable-next-line:no-unused-expression
  new Application();
}

main().catch((e) => { console.error(e.stack || e); });
