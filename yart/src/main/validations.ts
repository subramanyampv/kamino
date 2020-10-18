import { Git } from './git/git';
import { NextSemVer } from './next-semver';

export function requireNoVersionsAtHead(git: Git): void {
  const versionsAtHead = git.versionsAtHead();
  if (versionsAtHead && versionsAtHead.length) {
    if (versionsAtHead.length > 1) {
      throw new Error(`The current commit is already tagged with versions ${versionsAtHead.join(', ')}`);
    } else {
      throw new Error(`The current commit is already tagged with version ${versionsAtHead[0]}`);
    }
  }
}

export function requireNextVersion(nextSemVer: NextSemVer): void {
  if (!nextSemVer.isDefined) {
    throw new Error('Please specify the version with -v');
  }
}

export function requireMasterBranch(git: Git): void {
  const branch = git.currentBranch();
  if (branch !== 'master') {
    throw new Error('Only the master branch can be tagged');
  }
}
