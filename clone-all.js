#!/usr/bin/env node

var Promise = require('promise');
var GitServer = require('./lib/GitServer');
var logger = require('./lib/logger');
var GitClone = require('./lib/GitClone');
var options = require('./lib/options');
var path = require('path');

/**
 * Tries to clone a repository.
 * If the location to clone into already exists, it skips cloning.
 */
function tryCloneRepo(cloneUrl, cloneLocation) {
    var cloner = new GitClone({
        cloneUrl: cloneUrl,
        cloneLocation: cloneLocation
    });

    return cloner.clone();
}

function processGitHub(repositoryResults) {
    var repositories = repositoryResults.repositories;
    var sshUsername = options.getSSHUsername();
    var localFolder = options.getOutputDirectory();
    var useHTTPS = options.getProtocol() === 'https';
    return Promise.all(repositories.map(function(repository) {
        var url = useHTTPS ? repository.clone_url : repository.ssh_url;
        if (sshUsername) {
            url = url.replace('ssh://', 'ssh://' + sshUsername + '@');
        }

        var cloneLocation = path.join(localFolder, repository.name);
        return tryCloneRepo(url, cloneLocation);
    }));
}

function summarizeErrors(cloneResults) {
    cloneResults.forEach(function(cloneResult) {
        if (cloneResult.error) {
            logger.error('Error cloning ' + cloneResult.cloneLocation + ': ' + cloneResult.error);
            process.exitCode = 1;
        }
    });
}

var gitServer = new GitServer();
var mainPromise = gitServer.getRepositories() // get repositories via REST API
    .then(processGitHub) // clone all
    .then(summarizeErrors) // list errors
    .catch(function(err) { // generic catch-all
        process.exitCode = 2;
        logger.error('An unexpected error occurred');
        logger.error(err);
    });

module.exports = mainPromise;
