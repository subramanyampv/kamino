var fsPromise = require('./fs_promise');
var _ = require('lodash');
var execPromise = require('./exec_promise');
var options = require('./options');
var logger = require('./logger');

function gitPull(cloneInstruction) {
    function signResult(pullResult) {
        return _.assign({}, cloneInstruction, { pullResult: pullResult });
    }

    function isLocationExisting() {
        return fsPromise.exists(cloneInstruction.location);
    }

    function pullIntoExistingLocation() {
        var dryRun = options.isDryRun();
        if (dryRun) {
            logger.log('Would have pulled ' + cloneInstruction.url + ' ' + cloneInstruction.location);
            return signResult('dryRun');
        }

        return execPromise('git pull', { cwd: cloneInstruction.location })
            .then(function(error) {
                if (error) {
                    logger.error('Error pulling ' + cloneInstruction.location);
                } else {
                    logger.log('Finished pulling ' + cloneInstruction.location);
                }

                return signResult(error ? 'error' : 'success');
            });
    }

    function pullIntoMissingLocation() {
        logger.log('Cannot pull ' + cloneInstruction.url + ' into missing location: ' + cloneInstruction.location);
        return signResult('error');
    }

    logger.verbose('Pulling ' + cloneInstruction.url + ' into ' + cloneInstruction.location);
    return isLocationExisting()
        .then(function(locationExists) {
            if (locationExists) {
                return pullIntoExistingLocation();
            } else {
                return pullIntoMissingLocation();
            }
        });
}

module.exports = gitPull;
