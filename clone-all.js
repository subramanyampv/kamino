#!/usr/bin/env node

var Promise = require('promise');
var github = require('./lib/github');
var logger = require('./lib/logger');
var gitClone = require('./lib/git_clone');
var repositoriesToCloneInstances = require('./lib/repositories_to_clone_instances');

function summarizeErrors(cloneResults) {
    cloneResults.forEach(function(cloneResult) {
        if (cloneResult.error) {
            logger.error('Error cloning ' + cloneResult.cloneLocation + ': ' + cloneResult.error);
            process.exitCode = 1;
        }
    });

    return cloneResults;
}

var mainPromise = github.getRepositories() // get repositories via REST API
    .then(repositoriesToCloneInstances) // convert results to array of clone instructions
    .then(function(cloneInstructions) {
        return Promise.all(cloneInstructions.map(gitClone));
    })
    .then(summarizeErrors) // list errors
    .catch(function(err) { // generic catch-all
        process.exitCode = 2;
        logger.error('An unexpected error occurred');
        logger.error(err);
    });

module.exports = mainPromise;
