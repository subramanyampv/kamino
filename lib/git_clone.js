var fsPromise = require('./fs_promise');
var _ = require('lodash');
var execPromise = require('./exec_promise');
var logger = require('./logger');

async function gitClone(cloneInstruction, options) {
    function signResult(cloneResult) {
        return _.assign({}, cloneInstruction, { cloneResult: cloneResult });
    }

    function cloneIntoExistingLocation() {
        logger.verbose('Skipped cloning ' + cloneInstruction.url + ' because target location ' + cloneInstruction.location + ' already exists');
        return signResult('skip');
    }

    async function cloneIntoMissingLocation() {
        var dryRun = options.dryRun;
        if (dryRun) {
            logger.log('Would have cloned ' + cloneInstruction.url + ' ' + cloneInstruction.location);
            return signResult(cloneInstruction, 'dryRun');
        }

        try {
            await execPromise('git clone ' + cloneInstruction.url + ' ' + cloneInstruction.location);
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
        return await cloneIntoExistingLocation();
    } else {
        return await cloneIntoMissingLocation();
    }
}

module.exports = gitClone;
