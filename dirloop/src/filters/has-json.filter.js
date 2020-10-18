const fs = require('fs');
const path = require('path');

module.exports = function hasJsonFilter(file, cliArgs) {
  if (!cliArgs.hasJson) {
    return true;
  }

  const [filename, query] = cliArgs.hasJson.split(';');
  if (!filename) {
    return false;
  }

  const resolvedFilename = path.resolve(cliArgs.dir, file.name, filename);
  if (!fs.existsSync(resolvedFilename)) {
    return false;
  }

  const contents = fs.readFileSync(resolvedFilename, 'utf8');
  if (!contents) {
    return false;
  }

  let json;
  try {
    json = JSON.parse(contents);
  } catch (e) {
    json = null;
  }

  if (!json) {
    return false;
  }

  if (!query) {
    return true;
  }

  // eslint-disable-next-line no-new-func
  const fn = new Function('j', `return !!(j.${query});`);
  return fn(json);
};
