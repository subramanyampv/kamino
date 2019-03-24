const fs = require('fs');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

// TODO switch all to async
class Git {
  /**
   * Creates a new instance of this class.
   * @param {string} dir The git directory
   */
  constructor(dir) {
    this.dir = dir;
  }

  isGitRepository() {
    return fs.existsSync(path.join(this.dir, '.git'));
  }

  /**
   * Runs a git command and returns the result of `spawnSync`.
   * @param {string[]} args The arguments to the git command.
   */
  run(args) {
    return spawnSync('git', args, { cwd: this.dir, encoding: 'utf8' });
  }

  runAsync(args) {
    return new Promise((resolve, reject) => {
      const childProcess = spawn('git', args, { cwd: this.dir, encoding: 'utf8' });

      let stdout = '';
      childProcess.stdout.on('data', (data) => {
        stdout += data;
      });

      childProcess.on('close', (status) => {
        resolve({
          status,
          stdout
        });
      });

      childProcess.on('error', (err) => {
        reject(err);
      });
    });
  }

  checkAsync(args, errorMessage) {
    return new Promise((resolve, reject) => {
      const childProcess = spawn('git', args, { cwd: this.dir, encoding: 'utf8' });

      let stdout = '';
      childProcess.stdout.on('data', (data) => {
        stdout += data;
      });

      childProcess.on('close', (status) => {
        if (status) {
          reject(new Error(`${errorMessage}: ${stdout}`));
        }

        resolve({
          status,
          stdout
        });
      });

      childProcess.on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * Runs a git command and throws an error if it fails.
   * Returns the result of `spawnSync`.
   * @param {string[]} args The arguments to the git command.
   * @param {string} errorMessage The error message to throw if the command fails.
   */
  check(args, errorMessage) {
    const result = this.run(args);
    if (result.status) {
      throw new Error(`${errorMessage}: ${result.stdout}`);
    }

    return result;
  }

  init() {
    this.check(['init'], 'Could not init');
  }

  initAsync() {
    return this.checkAsync(['init'], 'Could not init');
  }

  add(file) {
    this.check(['add', file], 'Could not add');
  }

  addAsync(file) {
    return this.checkAsync(['add', file], 'Could not add');
  }

  tags() {
    const { stdout } = this.check(['tag', '--sort=-v:refname'], 'Could not get git tags');
    return stdout.split(/\s/).filter(x => !!x);
  }

  tagsAtHead() {
    const { stdout } = this.check(['tag', '--points-at', 'HEAD', '--sort=-v:refname'], 'Could not get git tags');
    return stdout.split(/\s/).filter(x => !!x);
  }

  versions() {
    return this.tags().filter(x => x.startsWith('v')).map(x => x.replace('v', ''));
  }

  versionsAtHead() {
    return this.tagsAtHead().filter(x => x.startsWith('v')).map(x => x.replace('v', ''));
  }

  versionExists(version) {
    return this.versions().includes(version);
  }

  latestVersion() {
    return this.versions().find(x => !!x);
  }

  commit(message) {
    return this.check(['commit', '-m', message], 'Could not commit');
  }

  commitAsync(message) {
    return this.checkAsync(['commit', '-m', message], 'Could not commit');
  }

  tag(version) {
    return this.check([
      'tag', '-m', `Releasing version ${version}`, `v${version}`
    ], 'Could not tag');
  }

  /**
   * Pushes changes.
   */
  push() {
    return this.check(['push', '--follow-tags'], 'Could not push');
  }

  /**
   * Checks if the given repository has pending changes.
   * This uses `git diff-index --quiet HEAD --` which will fail
   * if there are pending changes.
   */
  async hasChanges() {
    const { status } = await this.runAsync(['diff-index', '--quiet', 'HEAD', '--']);
    return status !== 0;
  }

  checkoutNew(branchName) {
    this.check(['checkout', '-b', branchName], `Could not checkout new branch ${branchName}`);
  }

  currentBranch() {
    const { stdout } = this.check(['rev-parse', '--abbrev-ref', 'HEAD'], 'Could not determine current branch');
    return stdout.trim();
  }

  currentSha() {
    const { stdout } = this.check(['rev-parse', 'HEAD'], 'Could not parse current SHA-1');
    return stdout.trim();
  }
}

module.exports = {
  Git
};
