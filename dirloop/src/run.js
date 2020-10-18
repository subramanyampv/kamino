const path = require('path');
const logger = require('@ngeor/js-cli-logger');
const runAction = require('./actions/run.action');
const setJsonAction = require('./actions/set-json.action');

/**
 * Runs a command in the given subdirectory.
 * @param {string} subDir The subdirectory.
 * @param {*} cliArgs The CLI arguments.
 * @returns {boolean} A value indicating if the command failed.
 */
function runCommand(subDir, cliArgs) {
  const {
    dir,
    args,
    setJson,
  } = cliArgs;

  let failed = false;

  if (setJson) {
    setJsonAction(subDir, cliArgs);
  } else if (args && args.length) {
    failed = runAction(subDir, cliArgs);
  } else {
    const absDir = path.resolve(dir, subDir);
    logger.log(absDir);
  }

  return failed;
}

module.exports = {
  runCommand,
};
