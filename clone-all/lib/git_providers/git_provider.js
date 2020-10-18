const optionsParser = require('../options_parser');
const bitbucketCloud = require('./bitbucket_cloud');
const github = require('./github');

const providers = {
  bitbucket_cloud: bitbucketCloud,
  github,
};

/**
 * Gets repositories based on the selected provider.
 * @returns {Promise.<Array.<{name: string, clone_url: string, ssh_url: string}>>}
 * A promise that resolves into the found repositories.
 */
function getRepositories() {
  const options = optionsParser.get();
  const providerName = options.provider;
  if (!providerName) {
    return Promise.reject(
      new Error('No provider specified. Use the --provider option e.g. --provider=github'),
    );
  }

  const providerNames = Object.keys(providers);
  const matchingProviderNames = providerNames.filter((n) => n.startsWith(providerName));
  if (matchingProviderNames.length !== 1) {
    return Promise.reject(new Error(`Invalid provider: ${providerName}. Must be one of ${providerNames.join(', ')}.`));
  }

  const provider = providers[matchingProviderNames];
  return provider.getRepositories();
}

module.exports = {
  getRepositories,
};
