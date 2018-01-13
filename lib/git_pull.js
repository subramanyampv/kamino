var fsPromise = require('./fs_promise');
var _ = require('lodash');
var execPromise = require('./exec_promise');
var options = require('./options');
var logger = require('./logger');

async function gitPull(cloneInstruction) {
    function signResult(pullResult) {
        return _.assign({}, cloneInstruction, { pullResult: pullResult });
    }

    async function pullIntoExistingLocation() {
        var dryRun = options.isDryRun();
        if (dryRun) {
            logger.log('Would have pulled ' + cloneInstruction.url + ' ' + cloneInstruction.location);
            return signResult('dryRun');
        }

        try {
            await execPromise('git pull', { cwd: cloneInstruction.location });
            logger.log('Finished pulling ' + cloneInstruction.location);
            return signResult('success');
        } catch (error) {
            logger.error('Error pulling ' + cloneInstruction.location);
            return signResult('error');
        }
    }

    function pullIntoMissingLocation() {
        logger.log('Cannot pull ' + cloneInstruction.url + ' into missing location: ' + cloneInstruction.location);
        return signResult('error');
    }

    logger.verbose('Pulling ' + cloneInstruction.url + ' into ' + cloneInstruction.location);
    const isLocationExisting = await fsPromise.exists(cloneInstruction.location);
    if (isLocationExisting) {
        return await pullIntoExistingLocation();
    } else {
        return await pullIntoMissingLocation();
    }
}

module.exports = gitPull;
