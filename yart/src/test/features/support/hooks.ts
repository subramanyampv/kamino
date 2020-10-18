import { After, Before } from 'cucumber';
const rimraf = require('rimraf').sync;

let temporaryFolders = [];

let oldProcessArgV = null;
Before(() => {
  oldProcessArgV = process.argv;
});

After(() => {
  process.argv = oldProcessArgV;
  temporaryFolders.forEach(folder => rimraf(folder));
  temporaryFolders = [];
});

export function registerTemporaryFolder(temporaryFolder: string): void {
  temporaryFolders.push(temporaryFolder);
}
