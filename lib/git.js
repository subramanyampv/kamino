class Git {
  constructor(execAsync) {
    this.execAsync = execAsync;
  }

  bundle(gitDirectory, bundleLocation) {
    return this.execAsync(`git bundle ${bundleLocation} master`, { cwd: gitDirectory });
  }

  clone(cloneUrl, targetDirectory) {
    return this.execAsync(`git clone ${cloneUrl}`, { cwd: targetDirectory });
  }

  pull(gitDirectory) {
    return this.execAsync('git pull', { cwd: gitDirectory });
  }
}

module.exports = Git;
