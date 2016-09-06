#!/usr/bin/node

var fs = require('fs');
var https = require('https');
var Promise = require('promise');
var exec = require('child_process').exec;
var _ = require('lodash');

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
    return Promise.all(repositories.map(function(repository) {
        var url = repository.ssh_url; // jscs: ignore

        // var url = repository.clone_url;

        if (forceUsername) {
            url = url.replace('ssh://', 'ssh://' + forceUsername + '@');
        }

        var cloneLocation = '';
        if (localFolder) {
            cloneLocation = localFolder + repository.name;
        }

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

fs.readFile('clone-all-config.json', 'utf8', function(err, data) {
    var servers;

    if (err) {
        throw err;
    }

    servers = JSON.parse(data);
    var promises = servers.map(function(server) {
        return getRepositoryInfo(server).then(function(repositories) {
            return processGitHub(server, repositories);
        });
    });
    Promise.all(promises).then(function(data) {
        data.forEach(function(d) {
            d.forEach(function(repositoryResult) {
                console.log('Cloned ' + repositoryResult.cloneLocation + ', success = ' + repositoryResult.success);
            });
        });
    }).catch(function(err) {
        console.error(err);
    });
});
