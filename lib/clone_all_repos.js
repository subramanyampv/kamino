/** @module lib/clone_all_repos */
const repositoriesToCloneInstances = require('./repositories_to_clone_instances');
const handleRepo = require('./handle_repo');

/**
 * Clones all repositories.
 * @param {array} repositories - The repositories to clone.
 * @param {object} options - The command line options.
 * @returns {array} The combined result of all operations.
 */
module.exports = async function cloneAllRepos(repositories, options) {
    const cloneInstructions = repositoriesToCloneInstances(repositories, options);
    if (!cloneInstructions) {
        throw new Error('No clone instructions found!');
    }

    const result = [];
    for (let i = 0; i < cloneInstructions.length; i++) {
        const cloneInstruction = cloneInstructions[i];
        result.push(await handleRepo(cloneInstruction, options));
    }

    return result;
};
