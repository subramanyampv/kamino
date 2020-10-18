import { When } from 'cucumber';
import { main } from '../../../main/main';

async function run(): Promise<Error> {
  try {
    await main();
    return undefined;
  } catch (err) {
    return err;
  }
}

When('running with version argument {string}', async function (version) {
  process.argv = [
    'node',
    'main.js',
    '--dir',
    this.tempDirectory,
    '--no-push',
    '-v',
    version
  ];
  this.err = await run();
});

When(
  'running with version argument {string} in dry run',
  async function (version) {
    process.argv = [
      'node',
      'main.js',
      '--dir',
      this.tempDirectory,
      '--no-push',
      '-v',
      version,
      '--dry-run'
    ];
    this.err = await run();
  }
);

When('running without version argument', async function () {
  process.argv = [
    'node',
    'main.js',
    '--dir',
    this.tempDirectory,
    '--no-push'
  ];
  this.err = await run();
});
