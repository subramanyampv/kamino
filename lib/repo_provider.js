/**
 * Gets repositories based on the selected provider.
 * @param {object} options - The command line options.
 * @returns {Promise} A promise that resolves into the found repositories.
 */
async function getRepositories(options) {
    var providerName = options.provider;
    if (!providerName) {
        return Promise.reject(new Error('No provider specified. Use the --provider option e.g. --provider=github'));
    }

    var provider = require('./providers/' + providerName);
    return await provider.getRepositories(options);
}

module.exports = {
    getRepositories: getRepositories
};
