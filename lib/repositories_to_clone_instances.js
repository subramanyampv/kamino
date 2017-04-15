var path = require('path');
var options = require('./options');

module.exports = function(repositoryResults) {
    // test
    var repositories = repositoryResults.repositories;
    var localFolder = options.getOutputDirectory();
    var useHTTPS = options.getProtocol() === 'https';
    return repositories.map(function(repository) {
        var url = useHTTPS ? repository.clone_url : repository.ssh_url;
        if (!useHTTPS) {
            var sshUsername = options.getSSHUsername();
            if (sshUsername) {
                url = url.replace('ssh://', 'ssh://' + sshUsername + '@');
            }
        }

        var location = path.join(localFolder, repository.name);
        return {
            url: url,
            location: location,
            name: repository.name
        };
    });
};
