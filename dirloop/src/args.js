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
    .option('--has-json <file,query>', 'Only matches directories containing the given JSON file with the specified JSON content', '')
    .option('--eval-js <script>', 'A nodeJS script to determine if the directory should be included', '')
    .option('--set-json <file,query>', 'Update the specified JSON file', '')
    .option('--csv', 'Capture output and print it together with the directory name in a single line')
    .option('--dry-run', "Don't actually run any command")
    .option('-v, --verbose', 'Verbose output')
    .option('--shell', 'Run the command inside a shell')
    .option('--line-count', 'Print the number of non-empty lines that the command produced (in combination with --csv)')
    .option('-- <command> [options...]', 'The command to run')
    .parse(process.argv);

  return commander;
}

module.exports = {
  parseArguments,
};
