/** @module lib/repo_provider */

/**
 * Gets repositories based on the selected provider.
 * @param {object} options - The command line options.
 * @returns {Promise} A promise that resolves into the found repositories.
 */
function getRepositories(options) {
    const providerName = options.provider;
    if (!providerName) {
        return Promise.reject(
            new Error('No provider specified. Use the --provider option e.g. --provider=github'));
    }

    const provider = require('./providers/' + providerName);
    return provider.getRepositories(options);
}

module.exports = {
    getRepositories
};
