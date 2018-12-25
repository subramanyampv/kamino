const fs = require('fs');
const path = require('path');

function dirPrefixMatches(file, args) {
  return !args.dirPrefix
    || (
      args.dirPrefix
      && args.dirPrefix.length > 0
      && args.dirPrefix.find(p => file.name.startsWith(p))
    );
}

function hasFileMatches(file, args) {
  return !args.hasFile || fs.existsSync(path.resolve(args.dir, file.name, args.hasFile));
}

/**
 * Checks if the given argument represents a directory
 * and that directory's name matches the directory pattern.
 */
function isMatchingDir(file, args) {
  return file.isDirectory()
    && dirPrefixMatches(file, args)
    && hasFileMatches(file, args);
}

module.exports = {
  isMatchingDir,
};
