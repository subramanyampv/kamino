var options = require('../options');
var repoFetcher = require('../repo_fetcher');

function getRepositories() {
    var serverDefaults = {};
    serverDefaults.hostname = 'api.github.com';
    serverDefaults.port = 443;
    serverDefaults.method = 'GET';
    serverDefaults.headers = {};
    serverDefaults.headers['User-Agent'] = 'clone-all.js';
    serverDefaults.path = '/users/' + options.getUsername() + '/repos';
    return repoFetcher(serverDefaults, response => JSON.parse(response));
}

module.exports = {
    getRepositories: getRepositories
};
