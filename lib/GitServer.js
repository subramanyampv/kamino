var _ = require('lodash');
var https = require('https');
var options = require('./options');

/**
 * Performs an HTTPS request and returns a promise that resolves to the
 * body of the response.
 */
function dohttps(requestOptions) {
    return new Promise(function(resolve, reject) {
        var req = https.request(requestOptions, function(res) {
            var message = '';
            if (res.statusCode === 200) {
                res.on('data', function(chunk) {
                    message += chunk;
                });

                res.on('end', function() {
                    resolve(message);
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
        if (repositories.length <= 0 || options.isNoPagination()) {
            return {
                requestOptions: requestOptions,
                repositories: totalRepositories
            }; // last page of results
        }

        return getRepositoryInfo(requestOptions, pageNumber + 1, totalRepositories);
    });
}

class GitServer {
    constructor() {
        var server = {};
        server.hostname = 'api.github.com';
        server.port = 443;
        server.method = 'GET';
        server.headers = {};
        server.headers['User-Agent'] = 'clone-all.js';
        server.path = '/users/' + options.getUsername() + '/repos';
        this._server = server;
    }

    getRepositories() {
        return getRepositoryInfo(this._server);
    }
}

module.exports = GitServer;
