const { Command } = require('commander');
const fs = require('fs');
const process = require('process');
const { spawnSync } = require('child_process');
const path = require('path');
const logger = require('@ngeor/js-cli-logger');
const { name, version } = require('../package.json');

/**
 * @type {{dir: string, dirPrefix: string, args: string[], dryRun: boolean}}
 */
let args = null;

/**
 * Checks if the given argument represents a directory
 * and that directory's name matches the directory pattern.
 */
function isMatchingDir(file) {
  if (!file.isDirectory()) {
    return false;
  }

  if (args.dirPrefix) {
    return file.name.startsWith(args.dirPrefix);
  }

  return true;
}

/**
 * Parses the command line arguments.
 */
function parseArguments() {
  const commander = new Command();

  commander
    .name(name)
    .version(version)
    .option('--dir <dir>', 'The root directory containing other directories')
    .option(
      '--dir-prefix <prefix>',
      'An optional prefix to select only some directories',
    )
    .option('--dry-run', "Don't actually run any command")
    .option('-- <command> [options...]', 'The command to run')
    .option('-v, --verbose', 'Verbose output')
    .parse(process.argv);

  const defaults = {
    dir: '.',
    dirPrefix: '',
    dryRun: false,
  };

  Object.keys(defaults).forEach((key) => {
    commander[key] = commander[key] || defaults[key];
  });

  return commander;
}

function runCommand(file) {
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

function main() {
  args = parseArguments();
  logger.setVerboseEnabled(args.verbose);
  const files = fs.readdirSync(args.dir, { withFileTypes: true });
  files.forEach((file) => {
    const matches = isMatchingDir(file);
    if (matches) {
      runCommand(file);
    }
  });
}

module.exports = {
  main,
};
