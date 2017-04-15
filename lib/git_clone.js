var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var execPromise = require('./exec_promise');
var options = require('./options');
var logger = require('./logger');

function gitClone(clone) {

    function getBundleLocation() {
        var bundleDir = options.getBundleDirectory();
        if (!bundleDir) {
            return null;
        }

        return path.resolve(bundleDir, clone.name + '.bundle');
    }

    function isLocationExisting() {
        return new Promise(function(resolve) {
            fs.stat(clone.location, function(errorLocationDoesNotExist) {
                resolve(!errorLocationDoesNotExist);
            });
        });
    }

    function cloneIntoExistingLocation() {
        logger.log('Skipped cloning ' + clone.url + ' because target location ' + clone.location + ' already exists');
        return _.assign({}, clone, { skip: true });
    }

    function cloneIntoMissingLocation() {
        var dryRun = options.isDryRun();
        if (dryRun) {
            logger.log('Would have cloned ' + clone.url + ' ' + clone.location);
            var bundleLocation = getBundleLocation();
            if (bundleLocation) {
                logger.log('Would have created bundle ' + bundleLocation);
            }

            return clone;
        }

        return execPromise('git clone ' + clone.url + ' ' + clone.location)
            .then(function(error) {
                if (error) {
                    logger.error('Error cloning ' + clone.location);
                } else {
                    logger.log('Finished cloning ' + clone.location);
                }

                return _.assign({}, clone, { error: error });
            })
            .then(function(result) {
                var bundleLocation = getBundleLocation();
                if (!bundleLocation || result.error) {
                    return result;
                }

                return execPromise('git bundle create ' + bundleLocation + ' master', {
                    cwd: clone.location
                }).then(function(bundleError) {
                    if (bundleError) {
                        logger.error('Error creating bundle ' + clone.location);
                    } else {
                        logger.log('Finished creating bundle ' + clone.location);
                    }

                    return _.assign({}, clone, { error: bundleError });
                });
            });
    }

    logger.verbose('Cloning ' + clone.url + ' into ' + clone.location);
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
