const fs = require('fs');
const path = require('path');
const { updatePomFiles } = require('./pom');

/**
 * @typedef UpdateOptions
 * @type {object}
 * @property {string} dir The directory with the git repository.
 * @property {string} currentVersion The current version.
 * @property {string} newVersion The new version.
 */

/**
 * Updates the version in the project files and adds modified files to git.
 * @param {UpdateOptions} opts The update options.
 * @param {string} file The file to update the version in.
 */
async function updateTextFile(opts, file) {
  const result = [];
  const {
    dir, currentVersion, newVersion
  } = opts;
  const fullPath = path.join(dir, file);
  if (fs.existsSync(fullPath)) {
    const contents = fs.readFileSync(fullPath, 'utf8');
    const modifiedContents = contents.split(currentVersion).join(newVersion);
    if (contents !== modifiedContents) {
      fs.writeFileSync(fullPath, modifiedContents, 'utf8');
      result.push(file);
    }
  }

  return Promise.resolve(result);
}

/**
 * Updates the version in the project files and adds modified files to git.
 * @param {Git} git The git object.
 * @param {function(): Promise<string[]>} getModifiedFilesAsync A function that collects modified
 * files.
 */
async function updateAndAdd(git, getModifiedFilesAsync) {
  const files = await getModifiedFilesAsync();
  files.forEach((f) => git.add(f));
}

/**
 * Updates the version in the project files.
 * @param {Git} git - The git client.
 * @param {UpdateOptions} opts The update options.
 */
async function updateProjectFiles(git, opts) {
  await updateAndAdd(git, () => updatePomFiles(opts));
  await updateAndAdd(git, () => updateTextFile(opts, 'README.md'));
}

module.exports = {
  updateProjectFiles
};
