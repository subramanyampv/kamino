const path = require('path');
const { dom } = require('../xml');

/**
 * Gets a promise that resolves into the version defined in a pom file.
 * @param {string} dir The directory containing the pom file.
 */
async function getPomVersion(dir) {
  const pomFilePath = path.join(dir, 'pom.xml');
  const result = await dom(pomFilePath);
  return result.project.version;
}

module.exports = {
  getPomVersion
};
