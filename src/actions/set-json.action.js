const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const os = require('os');
const logger = require('@ngeor/js-cli-logger');

module.exports = function setJsonAction(subDir, cliArgs) {
  const {
    dir,
    dryRun,
    setJson,
  } = cliArgs;

  const [
    filename,
    jsonQuery,
  ] = setJson.split(';', 2);

  const resolvedFilename = path.resolve(dir, subDir, filename);

  const json = JSON.parse(fs.readFileSync(resolvedFilename, 'utf8'));
  const originalJson = _.cloneDeep(json);

  // eslint-disable-next-line no-new-func
  new Function('j', `(${jsonQuery});`)(json);

  if (_.isEqual(originalJson, json)) {
    logger.log(`File ${resolvedFilename} is unmodified`);
  } else if (dryRun) {
    logger.log(`Would have modified file ${resolvedFilename}`);
  } else {
    fs.writeFileSync(resolvedFilename, JSON.stringify(json, null, 2) + os.EOL, 'utf8');
  }
};
