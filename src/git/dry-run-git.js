/* eslint-disable no-console */
const { Git } = require('./git');

// TODO switch all to async
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

module.exports = {
  DryRunGit
};
