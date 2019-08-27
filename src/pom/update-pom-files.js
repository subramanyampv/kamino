const fs = require('fs');
const path = require('path');
const { dom, updateXml } = require('../xml');

/**
 * @typedef UpdateOptions
 * @type {object}
 * @property {string} dir The directory with the git repository.
 * @property {string} currentVersion The current version.
 * @property {string} newVersion The new version.
 */

/**
 * Updates the pom files in the given directory.
 * @param {UpdateOptions} opts The options.
 * @returns {Promise<string[]>} An array of the modified files.
 */
async function updatePomFiles(opts) {
  const {
    dir, currentVersion, newVersion
  } = opts;
  const pomFilePath = path.join(dir, 'pom.xml');
  let result = [];

  if (fs.existsSync(pomFilePath)) {
    const contents = await dom(pomFilePath);
    const modules = contents && contents.project
      && contents.project.modules && contents.project.modules.module;
    if (contents.project.version === currentVersion) {
      result.push('pom.xml');
      await updateXml(pomFilePath, { project: { version: newVersion } });
    }

    if (modules && modules.length) {
      await Promise.all(modules.map((module) => updateXml(
        path.join(dir, module, 'pom.xml'),
        { project: { parent: { version: newVersion } } }
      )));
      result = result.concat(modules.map((module) => path.join(module, 'pom.xml')));
    }
  }

  return result;
}

module.exports = {
  updatePomFiles
};
