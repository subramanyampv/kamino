var fsPromise = require('./fs_promise');
var _ = require('lodash');
var execPromise = require('./exec_promise');
var options = require('./options');
var logger = require('./logger');

function gitClone(cloneInstruction) {

    function signResult(cloneResult) {
        return _.assign({}, cloneInstruction, { cloneResult: cloneResult });
    }

    function isLocationExisting() {
        return fsPromise.exists(cloneInstruction.location);
    }

    function cloneIntoExistingLocation() {
        logger.log('Skipped cloning ' + cloneInstruction.url + ' because target location ' + cloneInstruction.location + ' already exists');
        return signResult('skip');
    }

    function cloneIntoMissingLocation() {
        var dryRun = options.isDryRun();
        if (dryRun) {
            logger.log('Would have cloned ' + cloneInstruction.url + ' ' + cloneInstruction.location);
            return signResult(cloneInstruction, 'dryRun');
        }

        return execPromise('git clone ' + cloneInstruction.url + ' ' + cloneInstruction.location)
            .then(function(error) {
                if (error) {
                    logger.error('Error cloning ' + cloneInstruction.location);
                } else {
                    logger.log('Finished cloning ' + cloneInstruction.location);
                }

                return signResult(error ? 'error': 'success');
            });
    }

    logger.verbose('Cloning ' + cloneInstruction.url + ' into ' + cloneInstruction.location);
    return isLocationExisting()
        .then(function(locationExists) {
            if (locationExists) {
                return cloneIntoExistingLocation();
            } else {
                return cloneIntoMissingLocation();
            }
        });
}

module.exports = gitClone;
