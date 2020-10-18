import { DryRunGit } from './dry-run-git';
import { Git } from './git';

/**
 * Initializes the git module.
 * @param dryRun If true, the git object will be read-only
 * @param dir    The git working directory
 */
export function initGit(dryRun: boolean, dir: string): Git {
  return dryRun ?
    new DryRunGit(dir) :
    new Git(dir);
}
