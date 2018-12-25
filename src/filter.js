const fs = require('fs');
const path = require('path');

function dirPrefixMatches(file, cliArgs) {
  return !cliArgs.dirPrefix
    || (
      cliArgs.dirPrefix
      && cliArgs.dirPrefix.length > 0
      && !!cliArgs.dirPrefix.find(p => file.name.startsWith(p))
    );
}

function hasFileMatches(file, cliArgs) {
  return !cliArgs.hasFile || fs.existsSync(path.resolve(cliArgs.dir, file.name, cliArgs.hasFile));
}

/**
 * Checks if the given argument represents a directory
 * and that directory's name matches the directory pattern.
 */
function isMatchingDir(file, cliArgs) {
  return file.isDirectory()
    && dirPrefixMatches(file, cliArgs)
    && hasFileMatches(file, cliArgs);
}

module.exports = {
  isMatchingDir,
};
