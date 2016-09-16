#!/usr/bin/env node

var fs = require('fs');
var Promise = require('promise');
var exec = require('child_process').exec;
var jsonReader = require('./lib/json_reader');
var GitServer = require('./lib/GitServer');
var console = require('./lib/logger');

function cloneRepo(cloneUrl, cloneLocation) {
    return new Promise(function(fullfill) {
        fs.stat(cloneLocation, function(err) {
            if (err) {
                console.log('cloning ' + cloneLocation);
                exec('git clone ' + cloneUrl + ' ' + cloneLocation, function(error) {
                    console.log('finished cloning ' + cloneLocation);
                    fullfill({
                        cloneLocation: cloneLocation,
                        error: error
                    });
                });
            } else {
                fullfill({
                    cloneLocation: cloneLocation,
                    skip: true
                });
            }
        });
    });
}

function processGitHub(cloneAllOptions, repositories) {
    cloneAllOptions = cloneAllOptions || {};
    var forceUsername = cloneAllOptions.forceUsername || '';
    var localFolder = cloneAllOptions.localFolder || '';
    var useHTTPS = cloneAllOptions.useHTTPS;
    return Promise.all(repositories.map(function(repository) {
        var url = useHTTPS ? repository.clone_url : repository.ssh_url; // jscs: ignore
        if (forceUsername) {
            url = url.replace('ssh://', 'ssh://' + forceUsername + '@');
        }

        var cloneLocation = (localFolder || '') + repository.name;
        return cloneRepo(url, cloneLocation);
    }));
}

var mainPromise = jsonReader('clone-all-config.json')
    .then(function(servers) {
        return servers.map(function(server) {
            return new GitServer(server);
        });
    })
    .then(function(serverDefinitions) {
        var promises = serverDefinitions.map(function(serverDefinition) {
            return serverDefinition.getRepositories();
        });

        return Promise.all(promises);
    })
    .then(function(repositoryResults) {
        var promises = repositoryResults.map(function(repositoryResult) {
            return processGitHub(repositoryResult.requestOptions['clone-all'], repositoryResult.repositories);
        });

        return Promise.all(promises);
    })
    .then(function(data) {
        data.forEach(function(d) {
            d.forEach(function(repositoryResult) {
                if (repositoryResult.error) {
                    console.error('Cloned ' + repositoryResult.cloneLocation + ', error = ' + repositoryResult.error);
                } else if (repositoryResult.skip) {
                    console.log('Skipped ' + repositoryResult.cloneLocation);
                }
            });
        });
    }).catch(function(err) {
        console.error(err);
    });

module.exports = mainPromise;
