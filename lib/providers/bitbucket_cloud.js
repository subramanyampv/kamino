/** @module lib/providers/bitbucket_cloud */
const repoFetcher = require('./repo_fetcher');

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
    clone_url: findCloneLink(v, 'https'),
    ssh_url: findCloneLink(v, 'ssh'),
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

function createRequest(options) {
  const password = options.password || process.env.BITBUCKET_PASSWORD;
  if (!password) {
    throw new Error('password missing');
  }

  const auth = Buffer.from(`${options.username}:${password}`).toString('base64');
  return {
    hostname: 'api.bitbucket.org',
    port: 443,
    method: 'GET',
    headers: {
      'User-Agent': 'clone-all.js',
      Accept: 'application/json',
      Authorization: `Basic ${auth}`,
    },
    path: `/2.0/repositories/${options.owner}`,
  };
}

/**
 * Fetches bitbucket repositories.
 * @param {object} options - The command line options.
 * @returns {array} A collection of repositories.
 */
function getRepositories(options) {
  return repoFetcher(createRequest(options), transform, options);
}

module.exports = {
  getRepositories,
};
