const fs = require('fs');
const path = require('path');
const AbstractAction = require('./abstract.action');
const logger = require('../logger');

class CloneAction extends AbstractAction {
  /**
   * Creates an instance of this class.
   * @param {*} options The options of the action.
   * @param {import('../git')} git The git implementation.
   */
  constructor(options, git) {
    super(options);
    this.git = git;
  }

  async run(repository) {
    // clone - pull
    const { name } = repository;
    const { output, clone, pull } = this.options;

    const expectedRepositoryPath = path.join(output, name);
    const repositoryPathAlreadyExists = fs.existsSync(expectedRepositoryPath);
    const shouldClone = !repositoryPathAlreadyExists && clone;

    if (shouldClone) {
      logger.log(`Cloning repository ${name}`);
      await this.git.clone(this.cloneUrl(repository), output);
    }

    const shouldPull = repositoryPathAlreadyExists && pull;
    if (shouldPull) {
      logger.log(`Pulling repository ${name}`);
      await this.git.pull(expectedRepositoryPath);
    }

    if ((repositoryPathAlreadyExists || shouldClone) && this.options.bundleDir) {
      logger.log(`Creating bundle for repository ${name}`);
      await this.git.bundle(expectedRepositoryPath, path.join(this.options.bundleDir, `${name}.bundle`));
    }
  }

  cloneUrl(repository) {
    const useHttps = this.options.protocol === 'https';
    let url = useHttps ? repository.clone_url : repository.ssh_url;
    if (!useHttps) {
      const { sshUsername } = this.options;
      if (sshUsername) {
        url = url.replace('git@', `${sshUsername}@`);
      }
    }

    return url;
  }
}

module.exports = CloneAction;
