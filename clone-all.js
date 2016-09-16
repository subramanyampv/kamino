#!/usr/bin/env node

var fs = require('fs');
var https = require('https');
var Promise = require('promise');
var exec = require('child_process').exec;
var _ = require('lodash');
var jsonReader = require('./lib/json_reader');

/**
 * Performs an HTTPS request and returns a promise that resolves to the
 * body of the response.
 */
function dohttps(requestOptions) {
    return new Promise(function(fullfill, reject) {
        var req = https.request(requestOptions, function(res) {
            var message = '';
            if (res.statusCode === 200) {
                res.on('data', function(chunk) {
                    message += chunk;
                });

                res.on('end', function() {
                    fullfill(message);
                });
            } else {
                reject(res.statusCode);
                res.on('data', function(d) {
                    process.stdout.write(d);
                });
            }
        });

        req.end();

        req.on('error', function(e) {
            reject(e);
        });
    });
}

function cloneRepo(cloneUrl, cloneLocation) {
    return new Promise(function(fullfill, reject) {
        fs.stat(cloneLocation, function(err, stats) {
            if (err) {
                console.log('cloning ' + cloneLocation);
                exec('git clone ' + cloneUrl + ' ' + cloneLocation, function(error, stdout, stderr) {
                    console.log('finished cloning ' + cloneLocation);
                    fullfill({
                        cloneLocation: cloneLocation,
                        success: !error
                    });
                });
            } else {
                console.error(cloneLocation + ' already exists');
                fullfill({
                    cloneLocation: cloneLocation,
                    success: false
                });
            }
        });
    });
}

function processGitHub(requestOptions, repositories) {
    var cloneAllOptions = requestOptions['clone-all'] || {};
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

/**
 * Fetches repository information from GitHub.
 */
function getRepositoryInfo(requestOptions, pageNumber, totalRepositories) {
    var ro = _.cloneDeep(requestOptions);
    pageNumber = pageNumber || 1;
    totalRepositories = totalRepositories || [];
    if (pageNumber > 1) {
        ro.path = ro.path + '?page=' + pageNumber;
    }

    return dohttps(ro).then(function(jsonRepositories) {
        return JSON.parse(jsonRepositories);
    }).then(function(repositories) {
        totalRepositories = totalRepositories.concat(repositories);
        if (repositories.length <= 0 || !requestOptions['clone-all'].fetchAllPages) {
            return totalRepositories; // last page of results
        }

        return getRepositoryInfo(requestOptions, pageNumber + 1, totalRepositories);
    });
}

/**
 * Sets the default values for a GitHub server.
 */
function setDefaultValues(server) {
    var result = _.cloneDeep(server);
    result.hostname = result.hostname || 'api.github.com';
    result.port = result.port || 443;
    result.method = result.method || 'GET';
    result.headers = result.headers || {};
    result.headers['User-Agent'] = result.headers['User-Agent'] || 'clone-all.js';
    return result;
}

var mainPromise = jsonReader('clone-all-config.json').then(function(servers) {
    var promises = servers.map(function(server) {
        server = setDefaultValues(server);
        return getRepositoryInfo(server).then(function(repositories) {
            return processGitHub(server, repositories);
        });
    });

    return Promise.all(promises);
}).then(function(data) {
    data.forEach(function(d) {
        d.forEach(function(repositoryResult) {
            console.log('Cloned ' + repositoryResult.cloneLocation + ', success = ' + repositoryResult.success);
        });
    });
}).catch(function(err) {
    console.error(err);
});

module.exports = mainPromise;
