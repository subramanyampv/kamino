var options = require('./options');

/**
 * Gets repositories based on the selected provider.
 * @returns {Promise} A promise that resolves into the found repositories.
 */
async function getRepositories() {
    var providerName = options.getProvider();
    if (!providerName) {
        return Promise.reject(new Error('No provider specified. Use the --provider option e.g. --provider=github'));
    }

    var provider = require('./providers/' + providerName);
    return await provider.getRepositories();
}

module.exports = {
    getRepositories: getRepositories
};
