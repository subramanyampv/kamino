const logger = require('@ngeor/js-cli-logger');
const optionsParser = require('../options_parser');
const httpsPromise = require('../https_promise');

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
 * Maps a bitbucket repository to the structure expected by this application.
 * @param {object} v - The repository object.
 * @returns {{name: string, clone_url: string, ssh_url: string}} The mapped repository.
 */
function mapValue(v) {
  return {
    name: v.slug,
    clone_url: findCloneLink(v, 'https'),
    ssh_url: findCloneLink(v, 'ssh'),
  };
}

/**
 * Fetches bitbucket repositories.
 * @param {object} options - The command line options.
 * @returns {array} A collection of repositories.
 */
async function getRepositories() {
  const options = optionsParser.get();
  const { owner } = options;
  if (!owner) {
    throw new Error('owner is mandatory for Bitbucket');
  }

  let { username, password } = options;
  if (!username) {
    username = process.env.BITBUCKET_USERNAME;
  }

  if (!password) {
    password = process.env.BITBUCKET_PASSWORD;
  }

  // create request options
  const requestOptions = {
    method: 'GET',
    headers: {
      'User-Agent': 'clone-all.js',
      Accept: 'application/json',
    },
  };

  if (username && password) {
    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    requestOptions.headers.Authorization = `Basic ${auth}`;
  }

  // the first-page url
  let url = `https://api.bitbucket.org/2.0/repositories/${owner}`;
  let repositories = [];

  while (url) {
    logger.log(`Fetching repository info ${url}`);
    // eslint-disable-next-line no-await-in-loop
    const { message } = await httpsPromise.request(url, requestOptions);
    const response = JSON.parse(message);
    const pageRepositories = response.values.map(mapValue);
    repositories = repositories.concat(pageRepositories);
    url = response.next;
  }

  return repositories;
}

module.exports = {
  getRepositories,
};
