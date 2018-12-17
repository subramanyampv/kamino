/** @module lib/options_parser */
const process = require('process');
const { Command } = require('commander');
const { name, version } = require('../package.json');
const logger = require('./logger');

// eslint-disable-next-line no-underscore-dangle
let _options = null;

/**
 * Verifies that all mandatory arguments are present.
 * @param {object} commander - The command line options.
 */
function validateArguments(commander) {
  let valid = true;
  if (!commander.provider) {
    logger.error('Error: you need to specify the repository provider with --provider');
    valid = false;
  }

  if (!commander.username) {
    logger.error('Error: you need to specify the username with --username');
    valid = false;
  }

  if (!valid) {
    commander.outputHelp();
    process.exit(1);
  }
}

/**
 * If verbose mode is enabled, prints all arguments to the console.
 * @param {object} commander - The command line options.
 * @param {object} keys - The keys to print.
 */
function printArguments(commander, keys) {
  Object.keys(keys).forEach(key => logger.verbose(`${key}: ${commander[key]}`));
}

module.exports = {
  /**
   * Parses the command line options.
   * @returns {object} The command line options.
   */
  parse() {
    const commander = new Command();

    /* eslint-disable max-len */

    commander
      .name(name) // needed for unit tests
      .version(version)
      .option('-p, --provider <provider>', 'The git provider (github, bitbucket_cloud)', /^(github|bitbucket_cloud)$/)
      .option('--owner [owner]', 'The owner of the git repository (for bitbucket cloud)')
      .option('--username <username>', 'The username of the git repository')
      .option('--password [password]', 'The password for Bitbucket basic authentication')
      .option('--output <path>', 'The path where repositories should be cloned into')
      .option('--bundle-dir [path]', 'The path where git bundles should be created in')
      .option('--protocol [protocol]', 'The git protocol (ssh or https)', /^(https|ssh)$/, 'ssh')
      .option('--ssh-username [ssh-username]', 'The username for SSH protocol')
      .option('--dry-run', 'Do not perform any changes')
      .option('-v, --verbose', 'Increase logging verbosity')
      .option('--no-pagination', 'Fetch only one page of repositories')
      .option('--no-forks', 'Do not fetch forked repositories')
      .option('--no-archived', 'Do not fetch archived repositories')
      .option('--no-clone', 'Do not clone repositories that are missing')
      .option('--no-pull', 'Do not pull repositories that are already present locally')
      .option('--list', 'Display a summary of information per repository')
      .parse(process.argv);

    /* eslint-enable max-len */

    const defaults = {
      verbose: false,
      dryRun: false,
      sshUsername: '',
      owner: '',
      username: '',
      password: '',
      bundleDir: '',
      output: '',
      provider: '',
      list: false,
    };

    Object.keys(defaults).forEach((key) => {
      commander[key] = commander[key] || defaults[key];
    });

    validateArguments(commander);

    logger.setVerboseEnabled(!!commander.verbose);

    printArguments(commander, defaults);

    _options = commander;

    return commander;
  },

  /**
   * Returns the parsed options.
   * @returns {object} The parsed options.
   */
  get() {
    return _options;
  },
};
