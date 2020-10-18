const fs = require('fs');
const path = require('path');

module.exports = function hasFileFilter(file, cliArgs) {
  return !cliArgs.hasFile || fs.existsSync(path.resolve(cliArgs.dir, file.name, cliArgs.hasFile));
};
