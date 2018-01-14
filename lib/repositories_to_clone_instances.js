var path = require('path');

module.exports = function(repositories, options) {
    // test
    var localFolder = options.output;
    var useHTTPS = options.protocol === 'https';
    return repositories.map(function(repository) {
        var url = useHTTPS ? repository.clone_url : repository.ssh_url;
        if (!useHTTPS) {
            var sshUsername = options.sshUsername;
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
