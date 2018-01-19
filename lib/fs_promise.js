const fs = require('fs');

/**
 * Checks if the given path exists.
 * @param {string} location - The path.
 * @returns {Promise<boolean>} A promise that resolves into a boolean.
 */
function exists(location) {
    return new Promise(function(resolve) {
        fs.stat(location, function(errorLocationDoesNotExist) {
            resolve(!errorLocationDoesNotExist);
        });
    });
}

module.exports = {
    exists
};
