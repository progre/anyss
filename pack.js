const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const cpx = promisify(require('cpx').copy);
const zip = promisify(require('cross-zip').zip);
const electronPackager = promisify(require('electron-packager'));
const rebuild = (require('electron-rebuild') || { default: null }).default;
const mkdir = promisify(require('fs').mkdir);
const fetch = require('node-fetch');
const package = require('./package.json');
const appName = package.name;
const electronVersion = package.devDependencies.electron.slice(1);

async function main() {
  await mkdir('tmp').catch(errorHandler);
  await mkdir('tmp/dest').catch(errorHandler);
  await cpx('lib/**/*', 'tmp/dest/lib');
  await cpx('LICENSE', 'tmp/dest/');
  await cpx('package.json', 'tmp/dest/');
  await cpx('README*.md', 'tmp/dest/');
  // await execPackageAndZip(electronVersion, 'tmp', 'dest', 'darwin', 'x64', 'src/res/icon.png');
  await execPackageAndZip(electronVersion, 'tmp', 'dest', 'win32', 'ia32', 'src/res/icon.ico');
  // await execPackageAndZip(electronVersion, 'tmp', 'dest', 'linux', 'x64', null);
}

async function execPackageAndZip(version, cwd, path, platform, arch, icon) {
  const os = (() => {
    switch (platform) {
      case 'darwin': return 'mac';
      case 'win32': return 'win';
      case 'linux': return 'linux';
      default: throw new Error();
    }
  })();
  const zipPath = `tmp/${appName}-${platform}-${arch}`;
  await electronPackager({
    afterCopy: rebuild == null ? undefined : [(buildPath, electronVersion, platform, arch, callback) => {
      rebuild({ buildPath, electronVersion, arch })
        .then(() => callback())
        .catch((error) => callback(error));
    }],
    dir: `${cwd}\\${path}`,
    name: appName,
    platform,
    arch,
    version,
    icon,
    asar: true,
    out: cwd
  }).then(printStdout);
  await zip(zipPath, `${cwd}/${appName}-${os}.zip`);
}

function errorHandler(e) {
  if (e.code !== 'EEXIST') {
    throw e;
  }
}

function printStdout(stdout) {
  if (stdout.length > 0) {
    console.log(stdout);
  }
}

main().catch(e => console.error(e.stack || e));
