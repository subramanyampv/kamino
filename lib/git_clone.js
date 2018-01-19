const fsPromise = require('./fs_promise');
const _ = require('lodash');
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
     * Assigns the clone result into the clone instruction.
     * @param {object} cloneResult - The clone result.
     * @returns {object} The clone instruction enhanced with the clone result.
     */
    function signResult(cloneResult) {
        return _.assign({}, cloneInstruction, {
            cloneResult
        });
    }

    /**
     * Clones into an existing location.
     * @returns {object} The clone result.
     */
    function cloneIntoExistingLocation() {
        logger.verbose('Skipped cloning ' + cloneInstruction.url +
            ' because target location ' + cloneInstruction.location + ' already exists');
        return signResult('skip');
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
            return signResult(cloneInstruction, 'dryRun');
        }

        try {
            await execPromise('git clone ' + cloneInstruction.url + ' ' +
                cloneInstruction.location);
            logger.log('Finished cloning ' + cloneInstruction.location);
            return signResult('success');
        } catch (error) {
            logger.error('Error cloning ' + cloneInstruction.location);
            return signResult('error');
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
