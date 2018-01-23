/** @module lib/repositories_to_clone_instances */

const path = require('path');

/**
 * Converts repositories to clone instructions.
 * @param {array} repositories - The repositories to clone.
 * @param {{output: string, protocol: string, sshUsername: string}} options - The command
 * line options.
 * @returns {Array.<{url: string, location: string, name: string}>} The clone instructions.
 */
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
