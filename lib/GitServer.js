var _ = require('lodash');
var https = require('https');

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
            return {
                requestOptions: requestOptions,
                repositories: totalRepositories
            }; // last page of results
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

function GitServer(server) {
    this._server = setDefaultValues(server);
}

GitServer.prototype.getRepositories = function() {
    return getRepositoryInfo(this._server);
};

module.exports = GitServer;
