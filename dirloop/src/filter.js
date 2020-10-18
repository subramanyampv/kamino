const dirPrefixFilter = require('./filters/dir-prefix.filter');
const hasFileFilter = require('./filters/has-file.filter');
const hasJsonFilter = require('./filters/has-json.filter');
const evalJsFilter = require('./filters/eval-js.filter');

/**
 * Checks if the given argument represents a directory
 * and that the directory complies to the filters.
 */
function isMatchingDir(file, cliArgs) {
  return file.isDirectory()
    && dirPrefixFilter(file, cliArgs)
    && hasFileFilter(file, cliArgs)
    && hasJsonFilter(file, cliArgs)
    && evalJsFilter(file, cliArgs);
}

module.exports = {
  isMatchingDir,
};
