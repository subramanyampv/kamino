var fs = require('fs');
var execPromise = require('./exec_promise');
var options = require('./options');
var logger = require('./logger');

class GitClone {
    constructor(options) {
        this._cloneLocation = options.cloneLocation;
        this._cloneUrl = options.cloneUrl;
    }

    isLocationExisting() {
        const cloneLocation = this._cloneLocation;
        return new Promise(function(resolve) {
            fs.stat(cloneLocation, function(errorLocationDoesNotExist) {
                resolve(!errorLocationDoesNotExist);
            });
        });
    }

    cloneIntoExistingLocation() {
        const cloneLocation = this._cloneLocation;
        logger.log('Skipped cloning ' + this._cloneUrl + ' because target location ' + cloneLocation + ' already exists');
        return {
            cloneLocation: cloneLocation,
            skip: true
        };
    }

    cloneIntoMissingLocation() {
        const cloneUrl = this._cloneUrl;
        const cloneLocation = this._cloneLocation;

        var dryRun = options.isDryRun();
        if (dryRun) {
            logger.log('Would have cloned ' + cloneUrl + ' ' + cloneLocation);
            return {
                cloneLocation: cloneLocation
            };
        }

        return execPromise('git clone ' + cloneUrl + ' ' + cloneLocation)
            .then(function(error) {
                if (error) {
                    logger.error('Error cloning ' + cloneLocation);
                } else {
                    logger.log('Finished cloning ' + cloneLocation);
                }

                return {
                    cloneLocation: cloneLocation,
                    error: error
                };
            });
    }

    clone() {
        const _this = this;
        logger.verbose('Cloning ' + _this.cloneUrl + ' into ' + _this.cloneLocation);
        return _this.isLocationExisting()
            .then(function(locationExists) {
                if (locationExists) {
                    return _this.cloneIntoExistingLocation();
                } else {
                    return _this.cloneIntoMissingLocation();
                }
            });
    }
}

module.exports = GitClone;
