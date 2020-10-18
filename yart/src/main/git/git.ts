import fs = require('fs');
import path = require('path');
import { SpawnSyncReturns, spawnSync } from 'child_process';

export class Git {

  /**
   * Creates a new instance of this class.
   * @param {string} dir The git directory
   */
  constructor(protected dir: string) {
  }

  isGitRepository(): boolean {
    return fs.existsSync(path.join(this.dir, '.git'));
  }

  /**
   * Runs a git command and returns the result of `spawnSync`.
   * @param {string[]} args The arguments to the git command.
   */
  run(args): SpawnSyncReturns<string> {
    return spawnSync('git', args, { cwd: this.dir, encoding: 'utf8' });
  }

  /**
   * Runs a git command and throws an error if it fails.
   * Returns the result of `spawnSync`.
   * @param {string[]} args The arguments to the git command.
   * @param {string} errorMessage The error message to throw if the command fails.
   */
  check(args, errorMessage: string): SpawnSyncReturns<string> {
    const result = this.run(args);
    if (result.status) {
      throw new Error(`${errorMessage}: ${result.stdout}`);
    }

    return result;
  }

  init(): void {
    this.check(['init'], 'Could not init');
  }

  add(file: string): void {
    this.check([
      'add',
      file
    ], 'Could not add');
  }

  tags(): string[] {
    const { stdout } = this.check([
      'tag',
      '--sort=-v:refname'
    ], 'Could not get git tags');
    return stdout.split(/\s/).filter(line => !!line);
  }

  tagsAtHead(): string[] {
    const { stdout } = this.check([
      'tag',
      '--points-at',
      'HEAD',
      '--sort=-v:refname'
    ], 'Could not get git tags');
    return stdout.split(/\s/).filter(line => !!line);
  }

  versions(): string[] {
    return this.tags()
      .filter(tag => tag.startsWith('v'))
      .map(tag => tag.replace('v', ''));
  }

  versionsAtHead(): string[] {
    return this.tagsAtHead()
      .filter(tag => tag.startsWith('v'))
      .map(tag => tag.replace('v', ''));
  }

  versionExists(version: string): boolean {
    return this.versions().includes(version);
  }

  latestVersion(): string {
    return this.versions().find(version => !!version);
  }

  commit(message: string): void {
    this.check([
      'commit',
      '-m',
      message
    ], 'Could not commit');
  }

  tag(version: string): void {
    this.check([
      'tag',
      '-m',
      `Releasing version ${version}`,
      `v${version}`
    ], 'Could not tag');
  }

  /**
   * Pushes changes.
   */
  push(): void {
    this.check([
      'push',
      '--follow-tags'
    ], 'Could not push');
  }

  /**
   * Checks if the given repository has pending changes.
   * This uses `git diff-index --quiet HEAD --` which will fail
   * if there are pending changes.
   */
  hasChanges(): boolean {
    const { status } = this.run([
      'diff-index',
      '--quiet',
      'HEAD',
      '--'
    ]);
    return status !== 0;
  }

  checkoutNew(branchName): void {
    this.check([
      'checkout',
      '-b',
      branchName
    ], `Could not checkout new branch ${branchName}`);
  }

  currentBranch(): string {
    const { stdout } = this.check([
      'rev-parse',
      '--abbrev-ref',
      'HEAD'
    ], 'Could not determine current branch');
    return stdout.trim();
  }

  currentSha(): string {
    const { stdout } = this.check([
      'rev-parse',
      'HEAD'
    ], 'Could not parse current SHA-1');
    return stdout.trim();
  }
}
