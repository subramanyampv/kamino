const { Command } = require('commander');
const { name, version } = require('../package.json');

/**
 * @typedef CLIArguments
 * @type {object}
 * @property {string} source The source of the git tag information.
 * @property {string} V The new version.
 * @property {string} dir The git directory.
 * @property {string} [message] The commit message.
 * @property {boolean} dryRun If true, no changes should occur.
 * @property {boolean} verbose Increase logging verbosity.
 * @property {boolean} commit Should commit changes?
 * @property {boolean} push Should push changes?
 */

/**
 * Parses the command line options.
 * @returns {CLIArguments} The command line options.
 */
function parse() {
  const commander = new Command();

  commander
    .name(name) // needed for unit tests
    .version(version)
    .option('-v <version>', 'The new version to use. Must be semver and not leave gaps from '
      + 'previous version. It can also be one of major, minor, patch to automatically increment to the next version.')
    .option('--dir [dir]', 'The directory to run the command in', '.')
    .option('--message [message]', 'An optional commit message')
    .option('--dry-run', 'Do not perform any changes, see what would happen')
    .option('--no-push', 'Do not push')
    .option('--verbose', 'Increase logging verbosity')
    .parse(process.argv);

  return commander;
}

module.exports = {
  parse
};
