import { requireMasterBranch, requireNextVersion, requireNoVersionsAtHead } from './validations';
import { Git } from './git/git';
import { NextSemVer } from './next-semver';
import { SemVer } from './semver';

export function handleDefaultProject(
  currentGitVersion: SemVer,
  git: Git,
  nextSemVer: NextSemVer
): void {
  requireMasterBranch(git);
  requireNoVersionsAtHead(git);
  requireNextVersion(nextSemVer);
  const newVersion = nextSemVer.bump(currentGitVersion);
  git.tag(newVersion.value);
}
