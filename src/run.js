const { spawnSync } = require('child_process');
const path = require('path');
const logger = require('@ngeor/js-cli-logger');

function runCommand(file, args) {
  const absDir = path.resolve(args.dir, file.name);
  const noCommandSpecified = !args.args || !args.args.length;
  if (noCommandSpecified) {
    logger.log(absDir);
    return;
  }

  if (args.dryRun) {
    logger.log(`Would have run command ${args.args.join(' ')} in ${absDir}`);
    return;
  }

  logger.verbose(`Running command in ${absDir}`);

  const result = spawnSync(
    args.args[0],
    args.args.slice(1),
    {
      cwd: absDir,
      stdio: 'inherit',
    },
  );

  const { status } = result;

  if (status) {
    logger.error(`Command returned exit code ${status}`);
  }
}

module.exports = {
  runCommand,
};
