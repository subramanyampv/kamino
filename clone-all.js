#!/usr/bin/env node

var Promise = require('promise');
var GitServer = require('./lib/GitServer');
var console = require('./lib/logger');
var GitClone = require('./lib/GitClone');
var options = require('./lib/options');

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

function processGitHub(repositories) {
    var sshUsername = options.getSSHUsername();
    var localFolder = options.getOutputDirectory();
    var useHTTPS = options.getProtocol() === 'https';
    return Promise.all(repositories.map(function(repository) {
        var url = useHTTPS ? repository.clone_url : repository.ssh_url; // jscs: ignore
        if (sshUsername) {
            url = url.replace('ssh://', 'ssh://' + sshUsername + '@');
        }

        var cloneLocation = localFolder + repository.name;
        return tryCloneRepo(url, cloneLocation);
    }));
}

var gitServer = new GitServer();
var mainPromise = gitServer.getRepositories()
    .then(function(repositoryResult) {
        return processGitHub(repositoryResult.repositories);
    })
    .then(function(data) {
        data.forEach(function(repositoryResult) {
            if (repositoryResult.error) {
                console.error('Cloned ' + repositoryResult.cloneLocation + ', error = ' + repositoryResult.error);
                process.exitCode = 1;
            } else if (repositoryResult.skip) {
                console.log('Skipped ' + repositoryResult.cloneLocation);
            }
        });
    }).catch(function(err) {
        process.exitCode = 2;
        console.error(err);
    });

module.exports = mainPromise;
