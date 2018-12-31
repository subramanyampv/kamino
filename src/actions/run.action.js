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

module.exports = function runAction(file, cliArgs) {
  const {
    dir,
    dryRun,
    args,
    csv,
  } = cliArgs;

  const absDir = path.resolve(dir, file.name);

  if (dryRun) {
    logger.log(`Would have run command ${args.join(' ')} in ${absDir}`);
    return;
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
    logger.log(`${file.name},${stdout.trim()}`);
  }
};
