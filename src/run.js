const { spawnSync } = require('child_process');
const path = require('path');
const logger = require('@ngeor/js-cli-logger');

function runCommand(file, cliArgs) {
  const {
    dir,
    dryRun,
    args,
  } = cliArgs;

  const absDir = path.resolve(dir, file.name);
  const noCommandSpecified = !args || !args.length;
  if (noCommandSpecified) {
    logger.log(absDir);
    return;
  }

  if (dryRun) {
    logger.log(`Would have run command ${args.join(' ')} in ${absDir}`);
    return;
  }

  logger.verbose(`Running command in ${absDir}`);

  const result = spawnSync(
    args[0],
    args.slice(1),
    {
      cwd: absDir,
      stdio: 'inherit',
      shell: true,
    },
  );

  const { error, status } = result;

  if (error) {
    logger.error(`Command failed: ${error}`);
  }

  if (status) {
    logger.error(`Command returned exit code ${status}`);
  }
}

module.exports = {
  runCommand,
};
