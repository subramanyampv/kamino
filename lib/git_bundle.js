/** @module lib/git_bundle */
const fsPromise = require('./fs_promise');
const path = require('path');
const execPromise = require('./exec_promise');
const logger = require('./logger');

/**
 * Creates a git bundle for the given repository.
 * @param {object} cloneInstruction - The clone instruction.
 * @param {object} options - The command line options.
 * @returns {object} The bundle result.
 */
async function gitBundle(cloneInstruction, options) {
    /**
     * Gets the bundle location.
     * @returns {string} A path for creating the bundle in.
     */
    function getBundleLocation() {
        const bundleDir = options.bundleDir;
        if (!bundleDir) {
            throw new Error('Internal error: bundle should not have been called');
        }

        return path.resolve(bundleDir, cloneInstruction.name + '.bundle');
    }

    /**
     * Bundles into a missing location.
     * @returns {object} The result of the bundling.
     */
    function bundleIntoMissingLocation() {
        logger.log('Skipped bundling ' + cloneInstruction.url +
            ' because target location ' + cloneInstruction.location +
            ' does not exist');
        return 'error';
    }

    /**
     * Bundles into an existing location.
     * @param {string} bundleLocation - The bundle location.
     * @returns {object} The result of the bundling.
     */
    async function doBundle(bundleLocation) {
        try {
            await execPromise('git bundle create ' + bundleLocation + ' master', {
                cwd: cloneInstruction.location
            });
            logger.log('Finished creating bundle ' + cloneInstruction.location);
            return 'success';
        } catch (error) {
            logger.error('Error creating bundle ' + cloneInstruction.location);
            return 'error';
        }
    }

    /**
     * Bundles into an existing location.
     * @returns {object} The result of the bundling.
     */
    function bundleIntoExistingLocation() {
        const dryRun = options.dryRun;
        const bundleLocation = getBundleLocation();

        if (dryRun) {
            logger.log('Would have created bundle ' + bundleLocation);
            return 'dryRun';
        }

        return doBundle(bundleLocation);
    }

    logger.verbose('Bundling ' + cloneInstruction.url + ' into ' + cloneInstruction.location);
    const isLocationExisting = await fsPromise.exists(cloneInstruction.location);
    if (isLocationExisting) {
        return bundleIntoExistingLocation();
    } else {
        return bundleIntoMissingLocation();
    }
}

module.exports = gitBundle;
