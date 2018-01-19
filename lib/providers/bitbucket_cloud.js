const repoFetcher = require('../repo_fetcher');

/**
 * Finds the clone link.
 * @param {object} v - The repository object.
 * @param {string} protocol - The desired protocol.
 * @returns {string} The first matching clone link.
 */
function findCloneLink(v, protocol) {
    const cloneLinks = v.links.clone;
    return cloneLinks.filter(l => l.name === protocol)[0].href;
}

/**
 * Maps bitbucket's repository to the structure expected by this application.
 * @param {object} v - The repository object.
 * @returns {{name: string, clone_url: string, ssh_url: string}} The mapped repo.
 */
function mapValue(v) {
    return {
        name: v.slug,
        clone_url: findCloneLink(v, 'https'), // eslint-disable-line camelcase
        ssh_url: findCloneLink(v, 'ssh') // eslint-disable-line camelcase
    };
}

/**
 * Maps the JSON response into a collection of repositories.
 * @param {string} response - The JSON response.
 * @returns {array} An array of repositories.
 */
function transform(response) {
    const result = JSON.parse(response).values.map(mapValue);
    return result;
}

/**
 * Fetches bitbucket repositories.
 * @param {object} options - The command line options.
 * @returns {array} A collection of repositories.
 */
function getRepositories(options) {
    const serverDefaults = {};
    const auth = new Buffer(options.username + ':' + options.password).toString('base64');
    serverDefaults.hostname = 'api.bitbucket.org';
    serverDefaults.port = 443;
    serverDefaults.method = 'GET';
    serverDefaults.headers = {
        'User-Agent': 'clone-all.js',
        Accept: 'application/json',
        Authorization: 'Basic ' + auth
    };

    serverDefaults.path = '/2.0/repositories/' + options.owner;
    return repoFetcher(serverDefaults, transform, options);
}

module.exports = {
    getRepositories
};
