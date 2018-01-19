const path = require('path');

module.exports = function(repositories, options) {
    // test
    const localFolder = options.output;
    const useHTTPS = options.protocol === 'https';
    return repositories.map(function(repository) {
        let url = useHTTPS ? repository.clone_url : repository.ssh_url;
        if (!useHTTPS) {
            const sshUsername = options.sshUsername;
            if (sshUsername) {
                url = url.replace('ssh://', 'ssh://' + sshUsername + '@');
            }
        }

        const location = path.join(localFolder, repository.name);
        return {
            url,
            location,
            name: repository.name
        };
    });
};
