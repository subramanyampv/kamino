const fsPromise = require('./fs_promise');
const execPromise = require('./exec_promise');
const logger = require('./logger');

/**
 * Clones a repository.
 * @param {object} cloneInstruction - The clone instruction.
 * @param {object} options - The command line options.
 * @returns {object} The clone result.
 */
async function gitClone(cloneInstruction, options) {
    /**
     * Clones into an existing location.
     * @returns {object} The clone result.
     */
    function cloneIntoExistingLocation() {
        logger.verbose('Skipped cloning ' + cloneInstruction.url +
            ' because target location ' + cloneInstruction.location + ' already exists');
        return 'skip';
    }

    /**
     * Clones into a missing location.
     * @returns {object} The clone result.
     */
    async function cloneIntoMissingLocation() {
        const dryRun = options.dryRun;
        if (dryRun) {
            logger.log('Would have cloned ' + cloneInstruction.url +
                ' ' + cloneInstruction.location);
            return 'dryRun';
        }

        try {
            await execPromise('git clone ' + cloneInstruction.url + ' ' +
                cloneInstruction.location);
            logger.log('Finished cloning ' + cloneInstruction.location);
            return 'success';
        } catch (error) {
            logger.error('Error cloning ' + cloneInstruction.location);
            return 'error';
        }
    }

    logger.verbose('Cloning ' + cloneInstruction.url + ' into ' + cloneInstruction.location);
    const isLocationExisting = await fsPromise.exists(cloneInstruction.location);
    if (isLocationExisting) {
        return cloneIntoExistingLocation();
    } else {
        return cloneIntoMissingLocation();
    }
}

module.exports = gitClone;
