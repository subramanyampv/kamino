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

function getRepositories() {
    var serverDefaults = {};
    serverDefaults.hostname = 'api.github.com';
    serverDefaults.port = 443;
    serverDefaults.method = 'GET';
    serverDefaults.headers = {};
    serverDefaults.headers['User-Agent'] = 'clone-all.js';
    serverDefaults.path = '/users/' + options.getUsername() + '/repos';
    return getRepositoryInfo(_.assign(serverDefaults));
}

module.exports = {
    getRepositories: getRepositories
};
