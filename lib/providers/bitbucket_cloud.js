var options = require('../options');
var repoFetcher = require('../repo_fetcher');

function findCloneLink(v, protocol) {
    var cloneLinks = v.links.clone;
    return cloneLinks.filter(l => l.name === protocol)[0].href;
}

function mapValue(v) {
    return {
        name: v.slug,
        clone_url: findCloneLink(v, 'https'), // eslint-disable-line camelcase
        ssh_url: findCloneLink(v, 'ssh') // eslint-disable-line camelcase
    };
}

function transform(response) {
    var result = JSON.parse(response).values.map(mapValue);
    return result;
}

function getRepositories() {
    var serverDefaults = {};
    serverDefaults.hostname = 'api.bitbucket.org';
    serverDefaults.port = 443;
    serverDefaults.method = 'GET';
    serverDefaults.headers = {
        'User-Agent': 'clone-all.js',
        Accept: 'application/json',
        Authorization: 'Basic ' + new Buffer(options.getUsername() + ':' + options.getPassword()).toString('base64')
    };

    serverDefaults.path = '/2.0/repositories/' + options.getOwnerUsername();
    return repoFetcher(serverDefaults, transform);
}

module.exports = {
    getRepositories: getRepositories
};
