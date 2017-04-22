#!/usr/bin/env node

var repoProvider = require('./lib/repo_provider');
var logger = require('./lib/logger');
var gitClone = require('./lib/git_clone');
var repositoriesToCloneInstances = require('./lib/repositories_to_clone_instances');
var sequentialArrayPromise = require('./lib/sequential_array_promise');

function summarizeErrors(cloneResult) {
    if (cloneResult.error) {
        logger.error('Error cloning ' + cloneResult.cloneLocation + ': ' + cloneResult.error);
        process.exitCode = 1;
    }

    return cloneResult;
}

function handleSingleRepo(cloneInstruction) {
    return gitClone(cloneInstruction).then(summarizeErrors);
}

var mainPromise = repoProvider.getRepositories() // get repositories via REST API
    .then(repositoriesToCloneInstances) // convert results to array of clone instructions
    .then(function(cloneInstructions) {
        return sequentialArrayPromise(cloneInstructions, handleSingleRepo);
    })
    .catch(function(err) { // generic catch-all
        process.exitCode = 2;
        logger.error('An unexpected error occurred');
        logger.error(err);
    });

module.exports = mainPromise;
