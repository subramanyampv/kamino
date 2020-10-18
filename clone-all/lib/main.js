#!/usr/bin/env node

const logger = require('@ngeor/js-cli-logger');
const actionFactory = require('./actions/action.factory');
const gitProvider = require('./git_providers/git_provider');
const optionsParser = require('./options_parser');

/**
 * Gets all the repositories.
 * @returns {array} A collection of repositories.
 * @private
 */
async function getRepositories() {
  const repositories = await gitProvider.getRepositories();
  if (!repositories) {
    throw new Error('No repositories found!');
  }

  logger.verbose(`Found ${repositories.length} repositories`);
  return repositories;
}

/**
 * Processes all repositories.
 * @param {array} repositories - The repositories to process.
 * @returns {array} The combined result of the operation.
 * @private
 */
function processRepositories(repositories) {
  const action = actionFactory();
  for (let i = 0; i < repositories.length; i += 1) {
    action.run(repositories[i]);
  }
}

/**
 * The main function of the application.
 */
async function main() {
  optionsParser.parse();

  try {
    const repositories = await getRepositories();
    processRepositories(repositories);
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
