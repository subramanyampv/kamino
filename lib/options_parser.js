const process = require('process');
const { Command } = require('commander');
const logger = require('@ngeor/js-cli-logger');
const { name, version } = require('../package.json');

/**
 * The CLI options.
 * @typedef {Object} CliOptions
 * @property {'github'|'bitbucket_cloud'} provider - The repository provider.
 * @property {string} owner - The owner of the repositories.
 * @property {string} username - The username to access the repository provider API.
 * @property {string} password - The password to access the repository provider API.
 * @property {boolean} dryRun - If dry run mode is enabled.
 */

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
  Object.keys(keys).forEach((key) => logger.verbose(`${key}: ${commander[key]}`));
}

let cachedOptions = null;

/**
 * Parses the command line options.
 * @returns {CliOptions} The command line options.
 */
function parse() {
  const commander = new Command();

  /* eslint-disable max-len */

  // TODO remove commander
  /**
   * TODO
   * clone-all --help
   * clone-all --version
   * clone-all --provider github --owner ...
   * clone-all list --provider github|bitbucket --owner xxx --username ppp --password ppp
   *
   */

  // TODO change no-forks to include-forks, change no-archived to include-archived

  // TODO interactive mode to ask for credentials
  commander
    .name(name) // needed for unit tests
    .version(version)
    .option('-p, --provider <provider>', 'The git provider (github, bitbucket_cloud)')
    .option('--owner [owner]', 'The owner of the git repository (for bitbucket cloud)')
    .option('--username <username>', 'The username of the git repository')
    .option('--password [password]', 'The password for Bitbucket basic authentication')
    .option('--output <path>', 'The path where repositories should be cloned into')
    .option('--protocol [protocol]', 'The git protocol (ssh or https)', /^(https|ssh)$/, 'ssh')
    .option('--ssh-username [ssh-username]', 'The username for SSH protocol')
    .option('--dry-run', 'Do not perform any changes')
    .option('-v, --verbose', 'Increase logging verbosity')
    .option('--no-forks', 'Do not fetch forked repositories')
    .option('--no-archived', 'Do not fetch archived repositories')
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
    output: '.',
    provider: '',
    list: false,
    rememberPassword: false,
  };

  Object.keys(defaults).forEach((key) => {
    commander[key] = commander[key] || defaults[key];
  });

  validateArguments(commander);

  logger.setVerboseEnabled(!!commander.verbose);

  printArguments(commander, defaults);
  cachedOptions = commander;
  return commander;
}

/**
 * Returns the parsed command line options.
 * @returns {CliOptions} The command line options.
 */
function get() {
  return cachedOptions;
}

module.exports = {
  parse,
  get,
};
