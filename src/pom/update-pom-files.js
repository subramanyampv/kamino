const fs = require('fs');
const path = require('path');
const { SaxWriter } = require('../xml');
const { checkArg } = require('../utils');

class ChildPomVisitor extends SaxWriter {
  constructor(newVersion, moduleName) {
    super();
    this.newVersion = newVersion;
    this.moduleName = moduleName;
  }

  onText(text) {
    if (this.tagStack.isAtPath('project', 'parent', 'version')) {
      this.write(this.newVersion);
      this.result = path.join(this.moduleName, 'pom.xml');
    } else {
      super.onText(text);
    }
  }
}

function updateChildPomFile(dir, newVersion, moduleName) {
  const pomFilePath = path.join(dir, moduleName, 'pom.xml');
  const childPomVisitor = new ChildPomVisitor(newVersion, moduleName);
  return childPomVisitor.process(pomFilePath);
}

class PomVisitor extends SaxWriter {
  constructor(dir, currentVersion, newVersion) {
    super();
    this.childModules = [];
    this.dir = checkArg(dir, 'dir');
    this.currentVersion = checkArg(currentVersion, 'currentVersion');
    this.newVersion = checkArg(newVersion, 'newVersion');
  }

  onText(text) {
    if (this.tagStack.isAtPath('project', 'version') && text === this.currentVersion) {
      this.write(this.newVersion);
      this.result = 'pom.xml';
    } else {
      if (this.tagStack.isAtPath('project', 'modules', 'module')) {
        this.childModules.push(text);
      }

      super.onText(text);
    }
  }

  async process(filename) {
    // TODO it should pick up properties that match the version, based on a pattern for
    // safety or interactively via prompt.
    const pomResult = await super.process(filename);
    let result = [];
    if (pomResult) {
      result.push(pomResult);
      result = result.concat(
        await Promise.all(
          this.childModules.map(childModule => this.updateChildModule(childModule)),
        ),
      );
    }

    return result;
  }

  updateChildModule(childModule) {
    return updateChildPomFile(
      this.dir,
      this.newVersion,
      childModule,
    );
  }
}

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
  const pomVisitor = new PomVisitor(dir, currentVersion, newVersion);
  let result = [];

  if (fs.existsSync(pomFilePath)) {
    result = await pomVisitor.process(pomFilePath);
  }

  return result;
}

module.exports = {
  updatePomFiles
};
