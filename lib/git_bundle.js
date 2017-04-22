var fsPromise = require('./fs_promise');
var path = require('path');
var _ = require('lodash');
var execPromise = require('./exec_promise');
var options = require('./options');
var logger = require('./logger');

function gitBundle(cloneInstruction) {

    function signResult(bundleResult) {
        return _.assign({}, cloneInstruction, { bundleResult: bundleResult });
    }

    function getBundleLocation() {
        var bundleDir = options.getBundleDirectory();
        if (!bundleDir) {
            return null;
        }

        return path.resolve(bundleDir, cloneInstruction.name + '.bundle');
    }

    function isLocationExisting() {
        return fsPromise.exists(cloneInstruction.location);
    }

    function bundleIntoMissingLocation() {
        logger.log('Skipped bundling ' + cloneInstruction.url + ' because target location ' + cloneInstruction.location + ' does not exist');
        return signResult('error');
    }

    function bundleIntoExistingLocation() {
        var dryRun = options.isDryRun();
        var bundleLocation = getBundleLocation();
        if (!bundleLocation) {
            logger.log('No bundle location specified');
            return signResult('skip');
        }

        if (dryRun) {
            logger.log('Would have created bundle ' + bundleLocation);
            return signResult('dryRun');
        }

        return execPromise('git bundle create ' + bundleLocation + ' master', {
            cwd: cloneInstruction.location
        }).then(function(error) {
            if (error) {
                logger.error('Error creating bundle ' + cloneInstruction.location);
            } else {
                logger.log('Finished creating bundle ' + cloneInstruction.location);
            }

            return signResult(error ? 'error' : 'success');
        });
    }

    logger.verbose('Bundling ' + cloneInstruction.url + ' into ' + cloneInstruction.location);
    return isLocationExisting()
        .then(function(locationExists) {
            if (locationExists) {
                return bundleIntoExistingLocation();
            } else {
                return bundleIntoMissingLocation();
            }
        });
}

module.exports = gitBundle;
