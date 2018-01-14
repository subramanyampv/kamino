const fs = require('fs');
const path = require('path');

/**
 * Checks if the given path is a directory.
 * @param {string} path - The path to check.
 * @returns {boolean} true if the path is a directory, false otherwise.
 */
function isDirectory(path) {
    var s = fs.statSync(path);
    return s.isDirectory();
}

/**
 * Reads recursively the contents of the given directory.
 * @param {string} dirname - The path to read.
 * @returns {string[]} A collection of paths.
 */
function readdirSyncRecursive(dirname) {
    var contents = fs.readdirSync(dirname);
    var result = [];
    contents.map(f => path.join(dirname, f)).forEach(f => {
        if (isDirectory(f)) {
            result = result.concat(readdirSyncRecursive(f));
        } else {
            result.push(f);
        }
    });

    return result;
}

module.exports = readdirSyncRecursive;
