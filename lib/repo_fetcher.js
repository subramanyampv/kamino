var _ = require('lodash');
var options = require('./options');
var httpsPromise = require('./https_promise');

/**
 * Fetches all repositories described by the given request and maps them with the given converter.
 * In case of a paginated response, all pages will be fetched, unless specified otherwise in the command line options.
 *
 * @param {*} requestOptions - The options for the initial REST request.
 * @param {Function} responseConverter - A function that maps the JSON response to data.
 * @returns {Promise} A promise that resolves in the mapped response.
 */
function fetchRepos(requestOptions, responseConverter) {

    function getRepositories(pageNumber) {
        var requestOptionsClone = _.cloneDeep(requestOptions);
        if (pageNumber > 1) {
            requestOptionsClone.path = requestOptionsClone.path + '?page=' + pageNumber;
        }

        return httpsPromise(requestOptionsClone).then(function(response) {
            var repositories = responseConverter(response);
            return repositories;
        });
    }

    function getRepositoriesRecursive(existingRepositories, pageNumber) {
        return getRepositories(pageNumber).then(function(repositories) {
            if (repositories.length <= 0 || options.isNoPagination()) {
                return existingRepositories.concat(repositories);
            }

            return getRepositoriesRecursive(
                existingRepositories.concat(repositories),
                pageNumber + 1);
        });
    }

    return getRepositoriesRecursive([], 1);
}

module.exports = fetchRepos;
