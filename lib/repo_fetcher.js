var _ = require('lodash');
var httpsPromise = require('./https_promise');

/**
 * Filters the given repositories.
 * @param {array} repositories - The repositories to filter.
 * @param {object} options - The options to filter by.
 * @returns {array} The filtered repositories.
 * @private
 */
function filterRepositories(repositories, options) {
    if (options.forks) {
        return repositories;
    }

    return repositories.filter(r => !r.fork);
}

/**
 * Fetches all repositories described by the given request and maps them with
 * the given converter.
 *
 * In case of a paginated response, all pages will be fetched, unless specified
 * otherwise in the command line options.
 *
 * @param {*} requestOptions - The options for the initial REST request.
 * @param {Function} responseConverter - A function that maps the JSON response to data.
 * @param {object} options - The command line options.
 * @returns {Promise} A promise that resolves in the mapped response.
 */
async function fetchRepos(requestOptions, responseConverter, options) {
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
        const isLastPage = repositories.length <= 0;
        if (isLastPage || !options.pagination) {
            return existingRepositories.concat(repositories);
        }

        return await getRepositoriesRecursive(
            existingRepositories.concat(repositories),
            pageNumber + 1);
    }

    const allRepositories = await getRepositoriesRecursive([], 1);
    const filteredRepositories = filterRepositories(allRepositories, options);
    return filteredRepositories;
}

module.exports = fetchRepos;
