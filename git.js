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
      cwd: this.dir,
    });

    if (result.status) {
      throw new Error('Could not add');
    }
  }

  latestVersion() {
    const result = spawnSync('git', ['tag', '--sort=-v:refname'], {
      cwd: this.dir,
      encoding: 'utf8',
    });

    if (result.status) {
      throw new Error('Could not get git tags');
    }

    return result.stdout.split(/\s/).find(x => !!x).replace('v', '');
  }

  commit(message) {
    const result = spawnSync('git', ['commit', '-m', message], {
      cwd: this.dir,
    });

    if (result.status) {
      throw new Error('Could not commit');
    }
  }

  tag(version) {
    const result = spawnSync(
      'git', [
        'tag', '-m', `Releasing version ${version}`, `v${version}`,
      ], {
        cwd: this.dir,
      },
    );

    if (result.status) {
      throw new Error('Could not tag');
    }
  }

  push() {
    const result = spawnSync('git', ['push', '--follow-tags'], {
      cwd: this.dir,
    });

    if (result.status) {
      throw new Error('Could not push');
    }
  }
}

class DryRunGit extends Git {
  add(file) {
    console.log(`Would have added file ${file} in dir ${this.dir}`);
  }

  commit(message) {
    console.log(`Would have committed in dir ${this.dir} with message ${message}`);
  }

  tag(version) {
    console.log(`Would have tagged version ${version} as tag v${version} in dir ${this.dir}`);
  }

  push() {
    console.log(`Would have pushed in dir ${this.dir}`);
  }
}

/**
 * Creates a new git object.
 * @param {string} dir The git directory
 * @param {boolean} dryRun If true, the git object will be read-only
 */
function factory(dir, dryRun) {
  return dryRun ? new DryRunGit(dir) : new Git(dir);
}

module.exports = {
  factory,
};
