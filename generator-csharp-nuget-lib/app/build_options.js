const uuid = require('uuid');

/**
 * Builds the options.
 * @param {object} props - The input properties.
 * @returns {object} The options.
 */
module.exports = function buildOptions(props) {
  const { name } = props;
  const testName = `${name}.Tests`;
  const now = (new Date()).toISOString();
  const yearLength = 4;
  const dateLength = 10;
  const year = now.substr(0, yearLength);
  const date = now.substr(0, dateLength);
  return {
    name,
    nameToLower: name.toLowerCase(),
    testName,
    user: props.user,
    description: props.description,
    companyName: props.companyName,
    cliUUID: uuid.v1().toUpperCase(),
    libUUID: uuid.v1().toUpperCase(),
    solutionFilesUUID: uuid.v1().toUpperCase(),
    testsUUID: uuid.v1().toUpperCase(),
    now: date,
    year,
    version: props.version,
  };
};
