const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

function dirPrefixMatches(file, cliArgs) {
  return !cliArgs.dirPrefix
    || !cliArgs.dirPrefix.length
    || !!cliArgs.dirPrefix.find(p => file.name.startsWith(p));
}

function hasFileMatches(file, cliArgs) {
  return !cliArgs.hasFile || fs.existsSync(path.resolve(cliArgs.dir, file.name, cliArgs.hasFile));
}

function evalJsMatches(file, cliArgs) {
  if (!cliArgs.evalJs) {
    return true;
  }

  const absDir = path.resolve(cliArgs.dir, file.name);

  const { error, status } = childProcess.spawnSync(
    'node',
    ['-e', cliArgs.evalJs],
    {
      cwd: absDir,
      stdio: 'ignore',
    },
  );

  return !status && !error;
}

/**
 * Checks if the given argument represents a directory
 * and that directory's name matches the directory pattern.
 */
function isMatchingDir(file, cliArgs) {
  return file.isDirectory()
    && dirPrefixMatches(file, cliArgs)
    && hasFileMatches(file, cliArgs)
    && evalJsMatches(file, cliArgs);
}

module.exports = {
  isMatchingDir,
};
