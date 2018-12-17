#!/usr/bin/env node

const ActionFactory = require('./actions/action.factory');
const repoProvider = require('./providers/repo_provider');
const logger = require('./logger');
const optionsParser = require('./options_parser');

/**
 * Gets all the repositories.
 * @param {object} options - The command line options.
 * @returns {array} A collection of repositories.
 * @private
 */
async function getRepositories(options) {
  const repositories = await repoProvider.getRepositories(options);
  if (!repositories) {
    throw new Error('No repositories found!');
  }

  logger.verbose(`Found ${repositories.length} repositories`);
  return repositories;
}

/**
 * Processes all repositories.
 * @param {array} repositories - The repositories to process.
 * @param {object} options - The command line options.
 * @returns {array} The combined result of the operation.
 * @private
 */
async function processRepositories(repositories, options) {
  const actionFactory = new ActionFactory();
  const action = actionFactory.create(options);
  for (let i = 0; i < repositories.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await action.run(repositories[i]);
  }
}

/**
 * The main function of the application.
 */
async function main() {
  const options = optionsParser.parse();

  try {
    const repositories = await getRepositories(options);
    await processRepositories(repositories, options);
  } catch (err) {
    process.exitCode = 2;
    logger.error('An unexpected error occurred');
    logger.error(err);
  }
}

if (!Object.prototype.hasOwnProperty.call(process.env, 'LOADED_MOCHA_OPTS')) {
  main();
}

module.exports = main;
