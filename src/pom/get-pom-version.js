const path = require('path');
const { SaxVisitor } = require('../xml');

class PomVersionFinder extends SaxVisitor {
  onText(text) {
    if (this.tagStack.isAtPath('project', 'version')) {
      this.result = text;
    }
  }
}

/**
 * Gets a promise that resolves into the version defined in a pom file.
 * @param {string} dir The directory containing the pom file.
 */
function getPomVersion(dir) {
  const pomFilePath = path.join(dir, 'pom.xml');
  const pomVersionFinder = new PomVersionFinder();
  return pomVersionFinder.process(pomFilePath);
}

module.exports = {
  getPomVersion
};
