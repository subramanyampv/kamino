const logger = require('./logger');

function execAsync(cmd, options) {
  return new Promise(((resolve) => {
    logger.log(`Would have run command ${cmd} in directory ${options.cwd}`);
    resolve(null);
  }));
}

module.exports = execAsync;
