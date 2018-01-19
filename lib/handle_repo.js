const gitClone = require('./git_clone');
const gitPull = require('./git_pull');
const gitBundle = require('./git_bundle');

/**
 * Handles a single repository.
 * @param {object} cloneInstruction - The clone instruction.
 * @param {object} options - The command line options.
 * @returns {object} The combined result of the operations.
 */
async function handleRepo(cloneInstruction, options) {
    const cloneResult = await gitClone(cloneInstruction, options);

    let pullResult = 'skip';
    if (cloneResult === 'skip') {
        pullResult = await gitPull(cloneInstruction, options);
    }

    let bundleResult = 'skip';
    if (options.bundleDir) {
        bundleResult = await gitBundle(cloneInstruction, options);
    }

    return {
        clone: cloneResult,
        pull: pullResult,
        bundle: bundleResult
    };
}

module.exports = handleRepo;
