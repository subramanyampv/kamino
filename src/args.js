const { Command } = require('commander');
const { name, version } = require('../package.json');

function list(val) {
  return val.split(',');
}

/**
 * Parses the command line arguments.
 */
function parseArguments() {
  const commander = new Command();

  commander
    .name(name)
    .version(version)
    .option('--dir <dir>', 'The root directory containing other directories', '.')
    .option('--dir-prefix <prefix>', 'An optional set of prefixes to select only some directories', list, [])
    .option('--has-file <file>', 'Only match directories containing the given filename')
    .option('--eval-js <script>', 'A nodeJS script to determine if the directory should be included', '')
    .option('--dry-run', "Don't actually run any command")
    .option('-v, --verbose', 'Verbose output')
    .option('--no-shell', 'Do not run the command inside a shell')
    .option('-- <command> [options...]', 'The command to run')
    .parse(process.argv);

  return commander;
}

module.exports = {
  parseArguments,
};
