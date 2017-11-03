try { require('source-map-support').install(); } catch (e) { /* NOP */ }
import { app, BrowserWindow } from 'electron';
import Application from './applications/Application';

async function main() {
  await new Promise((resolve, reject) => app.once('ready', resolve));
  app.on('window-all-closed', app.quit.bind(app));
  const win = new BrowserWindow({
    alwaysOnTop: true,
    frame: false,
    height: 32,
    resizable: false,
    show: false,
    skipTaskbar: true,
    transparent: true,
    width: 640,
    x: 0,
    y: 0,
  });
  win.hide();
  // tslint:disable-next-line:no-unused-expression
  new Application(win);
  win.loadURL(`file://${__dirname}/public/index.html`);
}

main().catch((e) => { console.error(e.stack || e); });
