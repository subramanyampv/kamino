const fs = require('fs');
const path = require('path');
const logger = require('@ngeor/js-cli-logger');
const git = require('../git');
const optionsParser = require('../options_parser');

function cloneUrl(repository, options) {
  const useHttps = options.protocol === 'https';
  let url = useHttps ? repository.clone_url : repository.ssh_url;
  if (!useHttps) {
    const { sshUsername } = options;
    if (sshUsername) {
      url = url.replace('git@', `${sshUsername}@`);
    }
  }

  return url;
}

class CloneAction {
  // eslint-disable-next-line class-methods-use-this
  run(repository) {
    // clone - pull
    const options = optionsParser.get();
    const { name } = repository;
    const { output } = options;

    const expectedRepositoryPath = path.join(output, name);
    const repositoryPathAlreadyExists = fs.existsSync(expectedRepositoryPath);
    const shouldClone = !repositoryPathAlreadyExists;

    if (shouldClone) {
      logger.log(`Cloning repository ${name}`);
      git.clone(cloneUrl(repository, options), output);
    }
  }
}

module.exports = CloneAction;
