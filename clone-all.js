#!/usr/bin/env node

const repoProvider = require('./lib/repo_provider');
const logger = require('./lib/logger');
const gitClone = require('./lib/git_clone');
const gitPull = require('./lib/git_pull');
const gitBundle = require('./lib/git_bundle');
const repositoriesToCloneInstances = require('./lib/repositories_to_clone_instances');
const optionsParser = require('./lib/options_parser');

/**
 * Handles a single repository.
 * @param {object} cloneInstruction - The clone instruction.
 * @param {object} options - The command line options.
 * @returns {object} The combined result of the operations.
 */
async function handleSingleRepo(cloneInstruction, options) {
    const cloneResult = await gitClone(cloneInstruction, options);
    const pullResult = await gitPull(cloneResult, options);

    if (options.bundleDir) {
        return gitBundle(pullResult, options);
    }

    return pullResult;
}

/**
 * Creates the clone instruction objects.
 * @param {object} options - The command line options.
 * @returns {array} A collection of clone instructions.
 */
async function createCloneInstructions(options) {
    const repositories = await repoProvider.getRepositories(options);
    if (!repositories) {
        throw new Error('No repositories found!');
    }

    logger.verbose(`Found ${repositories.length} repositories`);

    const cloneInstructions = repositoriesToCloneInstances(repositories, options);
    if (!cloneInstructions) {
        throw new Error('No clone instructions found!');
    }

    return cloneInstructions;
}

/**
 * Handles all repositories.
 * @param {array} cloneInstructions - The clone instructions.
 * @param {object} options - The command line options.
 * @returns {array} The combined result of all operations.
 */
async function handleAllRepositories(cloneInstructions, options) {
    const result = [];
    for (let i = 0; i < cloneInstructions.length; i++) {
        const cloneInstruction = cloneInstructions[i];
        result.push(await handleSingleRepo(cloneInstruction, options));
    }

    return result;
}

/**
 * The main function of the application.
 * @returns {array} The combined result of all operations.
 */
async function main() {
    const options = optionsParser.parse();

    try {
        const cloneInstructions = await createCloneInstructions(options);
        return handleAllRepositories(
            cloneInstructions,
            options
        );
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
