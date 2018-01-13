var _ = require('lodash');
var options = require('./options');
var httpsPromise = require('./https_promise');

/**
 * Fetches all repositories described by the given request and maps them with
 * the given converter.
 *
 * In case of a paginated response, all pages will be fetched, unless specified
 * otherwise in the command line options.
 *
 * @param {*} requestOptions - The options for the initial REST request.
 * @param {Function} responseConverter - A function that maps the JSON response to data.
 * @returns {Promise} A promise that resolves in the mapped response.
 */
async function fetchRepos(requestOptions, responseConverter) {
    async function getRepositories(pageNumber) {
        var requestOptionsClone = _.cloneDeep(requestOptions);
        if (pageNumber > 1) {
            requestOptionsClone.path = requestOptionsClone.path + '?page=' + pageNumber;
        }

        const response = await httpsPromise(requestOptionsClone);
        var repositories = responseConverter(response);
        return repositories;
    }

    async function getRepositoriesRecursive(existingRepositories, pageNumber) {
        const repositories = await getRepositories(pageNumber);
        if (repositories.length <= 0 || options.isNoPagination()) {
            return existingRepositories.concat(repositories);
        }

        return await getRepositoriesRecursive(
            existingRepositories.concat(repositories),
            pageNumber + 1);
    }

    return await getRepositoriesRecursive([], 1);
}

module.exports = fetchRepos;
