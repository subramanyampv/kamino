#!/usr/bin/node

var fs = require('fs');
var https = require('https');
var Promise = require('promise');
var exec = require('child_process').exec;

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
                exec('git clone ' + cloneUrl + ' ' + cloneLocation, function(error, stdout, stderr) {
                    fullfill('Finished cloning ' + cloneUrl + ': ' + error);
                });
            } else {
                fullfill(cloneLocation + ' already exists');
            }
        });
    });
}

function processGitHub(requestOptions, jsonRepositories) {
    var repositories = JSON.parse(jsonRepositories);
    var cloneAllOptions = requestOptions['clone-all'] || {};
    var forceUsername = cloneAllOptions.forceUsername || '';
    var localFolder = cloneAllOptions.localFolder || '';
    return repositories.map(function(repository) {
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
    });
}

/**
 * Fetches repository information from GitHub.
 */
function getRepositoryInfo(requestOptions) {
    return dohttps(requestOptions).then(function(jsonRepositories) {
        return Promise.all(processGitHub(requestOptions, jsonRepositories));
    });
}

fs.readFile('clone-all-config.json', 'utf8', function(err, data) {
    var servers;

    if (err) {
        throw err;
    }

    servers = JSON.parse(data);
    var promises = servers.map(function(server) {
        return getRepositoryInfo(server);
    });
    Promise.all(promises).then(function(data) {
        // flatten array
        var newData = data.reduce(function(previousValue, currentValue) {
            return previousValue.concat(currentValue);
        }, []);
        console.log(newData);
    }).catch(function(err) {
        console.error(err);
    });
});
