const { spawnSync } = require('child_process');
const path = require('path');
const logger = require('@ngeor/js-cli-logger');

function runCommand(cliArgs, absDir) {
  const {
    args,
    shell,
    csv,
  } = cliArgs;

  if (csv) {
    return spawnSync(
      args[0],
      args.slice(1),
      {
        cwd: absDir,
        shell,
        encoding: 'utf8',
      },
    );
  }

  return spawnSync(
    args[0],
    args.slice(1),
    {
      cwd: absDir,
      shell,
      stdio: 'inherit',
    },
  );
}

module.exports = function runAction(subDir, cliArgs) {
  const {
    dir,
    dryRun,
    args,
    csv,
    lineCount,
  } = cliArgs;

  const absDir = path.resolve(dir, subDir);

  if (dryRun) {
    logger.log(`Would have run command ${args.join(' ')} in ${absDir}`);
    return false;
  }

  logger.verbose(`Running command in ${absDir}`);

  const { error, status, stdout } = runCommand(cliArgs, absDir);

  if (error) {
    logger.error(`Command failed: ${error}`);
  }

  if (status) {
    logger.error(`Command returned exit code ${status}`);
  }

  if (csv) {
    if (lineCount) {
      logger.log(`${subDir},${stdout.split(/[\r\n]/).map((x) => x.trim()).filter((x) => !!x).length}`);
    } else {
      logger.log(`${subDir},${stdout.trim()}`);
    }
  }

  return !(!error && !status);
};
