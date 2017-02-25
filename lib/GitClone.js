var fs = require('fs');
var execPromise = require('./lib/exec_promise');

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
        return {
            cloneLocation: cloneLocation,
            skip: true
        };
    }

    cloneIntoMissingLocation() {
        const cloneUrl = this._cloneUrl;
        const cloneLocation = this._cloneLocation;

        console.log('cloning ' + cloneLocation);
        return execPromise('git clone ' + cloneUrl + ' ' + cloneLocation)
            .then(function(error) {
                console.log('finished cloning ' + cloneLocation);
                return {
                    cloneLocation: cloneLocation,
                    error: error
                };
            });
    }

    clone() {
        const _this = this;
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
