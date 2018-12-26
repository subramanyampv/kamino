const path = require('path');
const logger = require('@ngeor/js-cli-logger');
const runAction = require('./actions/run.action');
const setJsonAction = require('./actions/set-json.action');

function runCommand(file, cliArgs) {
  const {
    dir,
    args,
    setJson,
  } = cliArgs;

  if (setJson) {
    setJsonAction(file, cliArgs);
  } else if (args && args.length) {
    runAction(file, cliArgs);
  } else {
    const absDir = path.resolve(dir, file.name);
    logger.log(absDir);
  }
}

module.exports = {
  runCommand,
};
