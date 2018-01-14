#!/usr/bin/env node

const repoProvider = require('./lib/repo_provider');
const logger = require('./lib/logger');
const gitClone = require('./lib/git_clone');
const gitPull = require('./lib/git_pull');
const gitBundle = require('./lib/git_bundle');
const repositoriesToCloneInstances = require('./lib/repositories_to_clone_instances');
const optionsParser = require('./lib/options_parser');

async function handleSingleRepo(cloneInstruction, options) {
    var cloneResult = await gitClone(cloneInstruction, options);
    var pullResult = await gitPull(cloneResult, options);

    if (options.bundleDir) {
        return await gitBundle(pullResult, options);
    }

    return pullResult;
}

async function main() {
    var result = [];
    const options = optionsParser.parse();

    try {
        var repositories = await repoProvider.getRepositories(options);
        if (!repositories) {
            throw new Error('No repositories found!');
        }

        logger.verbose(`Found ${repositories.length} repositories`);

        var cloneInstructions = repositoriesToCloneInstances(repositories, options);
        if (!cloneInstructions) {
            throw new Error('No clone instructions found!');
        }

        for (var i = 0; i < cloneInstructions.length; i++) {
            var cloneInstruction = cloneInstructions[i];
            result.push(await handleSingleRepo(cloneInstruction, options));
        }

        return result;
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
