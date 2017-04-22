#!/usr/bin/env node

var Promise = require('promise');
var repoProvider = require('./lib/repo_provider');
var logger = require('./lib/logger');
var gitClone = require('./lib/git_clone');
var repositoriesToCloneInstances = require('./lib/repositories_to_clone_instances');

function summarizeErrors(cloneResult) {
    if (cloneResult.error) {
        logger.error('Error cloning ' + cloneResult.cloneLocation + ': ' + cloneResult.error);
        process.exitCode = 1;
    }
}

var results = [];
var mainPromise = repoProvider.getRepositories() // get repositories via REST API
    .then(repositoriesToCloneInstances) // convert results to array of clone instructions
    .then(function(cloneInstructions) {
        return cloneInstructions.map(cloneInstruction => (()=>gitClone(cloneInstruction)));
    })
    .then(function(clonePromises) {
        return clonePromises.reduce(function(accumulator, currentValue) {
            return accumulator
                .then(currentValue)
                .then(function(result) {
                    results.push(result);
                    return result;
                })
                .then(summarizeErrors);
        }, Promise.resolve());
    })
    .then(function() {
        return results;
    })
    .catch(function(err) { // generic catch-all
        process.exitCode = 2;
        logger.error('An unexpected error occurred');
        logger.error(err);
    });

module.exports = mainPromise;
