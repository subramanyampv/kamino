const fsPromise = require('./fs_promise');
const execPromise = require('./exec_promise');
const logger = require('./logger');

/**
 * Pulls a repository.
 * @param {object} cloneInstruction - The clone instruction.
 * @param {object} options - The command line options.
 * @returns {object} The pull result.
 */
async function gitPull(cloneInstruction, options) {
    /**
     * Pulls into an existing location.
     * @returns {object} The pull result.
     */
    async function pullIntoExistingLocation() {
        const dryRun = options.dryRun;
        if (dryRun) {
            logger.log('Would have pulled ' + cloneInstruction.url +
                ' ' + cloneInstruction.location);
            return 'dryRun';
        }

        try {
            await execPromise('git pull', {
                cwd: cloneInstruction.location
            });
            logger.log('Finished pulling ' + cloneInstruction.location);
            return 'success';
        } catch (error) {
            logger.error('Error pulling ' + cloneInstruction.location);
            return 'error';
        }
    }

    /**
     * Pulls into a missing location.
     * @returns {object} The pull result (which is an error).
     */
    function pullIntoMissingLocation() {
        logger.log('Cannot pull ' + cloneInstruction.url +
            ' into missing location: ' + cloneInstruction.location);
        return 'error';
    }

    logger.verbose('Pulling ' + cloneInstruction.url + ' into ' + cloneInstruction.location);
    const isLocationExisting = await fsPromise.exists(cloneInstruction.location);
    if (isLocationExisting) {
        return pullIntoExistingLocation();
    } else {
        return pullIntoMissingLocation();
    }
}

module.exports = gitPull;
