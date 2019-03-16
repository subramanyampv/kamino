const { spawnSync } = require('child_process');

class Git {
  /**
   * Creates a new instance of this class.
   * @param {string} dir The git directory
   */
  constructor(dir) {
    this.dir = dir;
  }

  add(file) {
    const result = spawnSync('git', ['add', file], {
      cwd: this.dir
    });

    if (result.status) {
      throw new Error('Could not add');
    }
  }

  versionExists(version) {
    const result = spawnSync('git', ['tag', '--sort=-v:refname'], {
      cwd: this.dir,
      encoding: 'utf8'
    });

    if (result.status) {
      throw new Error('Could not get git tags');
    }

    return result.stdout.split(/\s/).filter(x => !!x).map(x => x.replace('v', '')).includes(version);
  }

  latestVersion() {
    const result = spawnSync('git', ['tag', '--sort=-v:refname'], {
      cwd: this.dir,
      encoding: 'utf8'
    });

    if (result.status) {
      throw new Error('Could not get git tags');
    }

    return result.stdout.split(/\s/).find(x => !!x).replace('v', '');
  }

  commit(message) {
    const result = spawnSync('git', ['commit', '-m', message], {
      cwd: this.dir
    });

    if (result.status) {
      throw new Error('Could not commit');
    }
  }

  tag(version) {
    const result = spawnSync(
      'git', [
        'tag', '-m', `Releasing version ${version}`, `v${version}`
      ], {
        cwd: this.dir
      },
    );

    if (result.status) {
      throw new Error('Could not tag');
    }
  }

  /**
   * Pushes changes.
   */
  push() {
    const args = ['push', '--follow-tags'];
    const result = spawnSync('git', args, {
      cwd: this.dir
    });

    if (result.status) {
      throw new Error('Could not push');
    }
  }

  /**
   * Checks if the given repository has pending changes.
   * This uses `git diff-index --quiet HEAD --` which will fail
   * if there are pending changes.
   */
  hasChanges() {
    const result = spawnSync(
      'git',
      ['diff-index', '--quiet', 'HEAD', '--'],
      { cwd: this.dir },
    );
    return result.status !== 0;
  }
}

module.exports = {
  Git
};
