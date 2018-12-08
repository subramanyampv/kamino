/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/** @module lib/providers/repo_provider */

/**
 * Gets repositories based on the selected provider.
 * @param {object} options - The command line options.
 * @returns {Promise.<Array.<{name: string, clone_url: string, ssh_url: string}>>}
 * A promise that resolves into the found repositories.
 */
function getRepositories(options) {
  const providerName = options.provider;
  if (!providerName) {
    return Promise.reject(
      new Error('No provider specified. Use the --provider option e.g. --provider=github'),
    );
  }

  const provider = require(`./${providerName}`);
  return provider.getRepositories(options);
}

module.exports = {
  getRepositories,
};
