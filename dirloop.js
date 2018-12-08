const { Command } = require('commander');
const fs = require('fs');
require('process');
const { spawnSync } = require('child_process');
const path = require('path');
const chalk = require('chalk');
const { name, version } = require('./package.json');

/**
 * @type {{dir: string, dirPrefix: string, args: string[], dryRun: boolean}}
 */
let args = null;

function log(message) {
  console.log(message);
}

function logVerbose(message) {
  if (args.verbose) {
    log(chalk.blue(message));
  }
}

function logError(message) {
  log(chalk.red(message));
}

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

  if (!commander.args || !commander.args.length) {
    logError('Command to run was not specified');
    commander.outputHelp();
    process.exit(1);
  }

  return commander;
}

function runCommand(file) {
  const absDir = path.resolve(args.dir, file.name);
  if (args.dryRun) {
    log(`Would have run command ${args.args.join(' ')} in ${absDir}`);
    return;
  }

  logVerbose(`Running command in ${absDir}`);

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
    logError(chalk.red(`Command returned exit code ${status}`));
  }
}

function main() {
  args = parseArguments();

  const files = fs.readdirSync(args.dir, { withFileTypes: true });
  files.forEach((file) => {
    const matches = isMatchingDir(file);
    if (matches) {
      runCommand(file);
    }
  });
}

main();
