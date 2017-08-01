var options = require('./options');
var Promise = require('Promise');

/**
 * Gets repositories based on the selected provider.
 * @returns {Promise} A promise that resolves into the found repositories.
 */
function getRepositories() {
    var providerName = options.getProvider();
    if (!providerName) {
        return Promise.reject(new Error('No provider specified. Use the --provider option e.g. --provider=github'));
    }

    var provider = require('./providers/' + providerName);
    return provider.getRepositories();
}

module.exports = {
    getRepositories: getRepositories
};
