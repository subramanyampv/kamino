#!/usr/bin/env node

const repoProvider = require('./lib/providers/repo_provider');
const logger = require('./lib/logger');
const optionsParser = require('./lib/options_parser');
const cloneAllRepos = require('./lib/clone_all_repos');
const listAllRepos = require('./lib/list_all_repos');

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
function processRepositories(repositories, options) {
    if (options.list) {
        return listAllRepos(repositories, options);
    }

    return cloneAllRepos(
        repositories,
        options
    );
}

/**
 * The main function of the application.
 * @returns {array} The combined result of all operations.
 */
async function main() {
    const options = optionsParser.parse();

    try {
        const repositories = await getRepositories(options);
        return await processRepositories(repositories, options);
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
