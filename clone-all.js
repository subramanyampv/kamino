#!/usr/bin/env node

var repoProvider = require('./lib/repo_provider');
var logger = require('./lib/logger');
var gitClone = require('./lib/git_clone');
var gitPull = require('./lib/git_pull');
var gitBundle = require('./lib/git_bundle');
var options = require('./lib/options');
var repositoriesToCloneInstances = require('./lib/repositories_to_clone_instances');

async function handleSingleRepo(cloneInstruction) {
    var cloneResult = await gitClone(cloneInstruction);
    var pullResult = await gitPull(cloneResult);

    if (options.getBundleDirectory()) {
        return await gitBundle(pullResult);
    }

    return pullResult;
}

async function main() {
    var result = [];

    if (options.isHelp() || !options.getUsername() || !options.getProvider()) {
        logger.log('Use clone-all to clone all your repositories.');
        logger.log('node clone-all.js --provider=github --username=ngeor --output=../');
        return result;
    }

    try {
        var repositories = await repoProvider.getRepositories();
        var cloneInstructions = repositoriesToCloneInstances(repositories);
        for (var i = 0; i < cloneInstructions.length; i++) {
            var cloneInstruction = cloneInstructions[i];
            result.push(await handleSingleRepo(cloneInstruction));
        }

        return result;
    } catch (err) {
        process.exitCode = 2;
        logger.error('An unexpected error occurred');
        logger.error(err);
    }
}

main();

module.exports = main;
