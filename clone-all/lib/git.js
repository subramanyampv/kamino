const childProcess = require('child_process');
const logger = require('@ngeor/js-cli-logger');
const optionsParser = require('./options_parser');

function run(cmd, args, cwd) {
  if (optionsParser.get().dryRun) {
    logger.info(`Would have run cmd ${cmd} in directory ${cwd}`);
    return;
  }

  const result = childProcess.spawnSync(cmd, args, { cwd });
  if (result.status) {
    throw new Error('Command failed');
  }
}

function clone(cloneUrl, targetDirectory) {
  run('git', ['clone', cloneUrl], targetDirectory);
}

module.exports = {
  clone,
};
