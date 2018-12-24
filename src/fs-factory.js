const fs = require('fs');

/**
 * Creates an instance of the file system.
 * @param {boolean} dryRun If true, the file system object will be read-only.
 */
function factory(dryRun) {
  if (!dryRun) {
    return fs;
  }

  return {
    ...fs,
    writeFileSync: function writeFileSync(path) {
      console.log(`Would have written path ${path}`);
    },
  };
}

module.exports = {
  factory,
};
