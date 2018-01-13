var fsPromise = require('./fs_promise');
var path = require('path');
var _ = require('lodash');
var execPromise = require('./exec_promise');
var options = require('./options');
var logger = require('./logger');

async function gitBundle(cloneInstruction) {
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

    function bundleIntoMissingLocation() {
        logger.log('Skipped bundling ' + cloneInstruction.url + ' because target location ' + cloneInstruction.location + ' does not exist');
        return signResult('error');
    }

    async function bundleIntoExistingLocation() {
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

        try {
            await execPromise('git bundle create ' + bundleLocation + ' master', {
                cwd: cloneInstruction.location
            });
            logger.log('Finished creating bundle ' + cloneInstruction.location);
            signResult('success');
        } catch (error) {
            logger.error('Error creating bundle ' + cloneInstruction.location);
            return signResult('error');
        }
    }

    logger.verbose('Bundling ' + cloneInstruction.url + ' into ' + cloneInstruction.location);
    const isLocationExisting = await fsPromise.exists(cloneInstruction.location);
    if (isLocationExisting) {
        return await bundleIntoExistingLocation();
    } else {
        return await bundleIntoMissingLocation();
    }
}

module.exports = gitBundle;
