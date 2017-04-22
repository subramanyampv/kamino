var _ = require('lodash');
var options = require('./options');
var httpsPromise = require('./https_promise');

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
