const path = require('path');
const logger = require('@ngeor/js-cli-logger');
const runAction = require('./actions/run.action');
const setJsonAction = require('./actions/set-json.action');

/**
 * Runs a command in the given subdirectory.
 * @param {string} subDir The subdirectory.
 * @param {*} cliArgs The CLI arguments.
 */
function runCommand(subDir, cliArgs) {
  const {
    dir,
    args,
    setJson,
  } = cliArgs;

  if (setJson) {
    setJsonAction(subDir, cliArgs);
  } else if (args && args.length) {
    runAction(subDir, cliArgs);
  } else {
    const absDir = path.resolve(dir, subDir);
    logger.log(absDir);
  }
}

module.exports = {
  runCommand,
};
