const path = require('path');

/**
 * Converts leading underscores to dots.
 * @param {string} file The filename to map
 */
function mapLeadingUnderscore(file) {
  return file.replace('_', '.');
}

function getFiles() {
  const files = [
    '.editorconfig',
    '.eslintrc.js',
    '.gitattributes',
    '_gitignore',
    '_npmignore',
    '_travis.yml',
    'package.json',
    'README.md',
    path.join('src', 'index.js'),
    path.join('src', 'index.test.js')
  ];

  return files.map((src) => ({
    src,
    dest: mapLeadingUnderscore(src)
  }));
}

module.exports = {
  getFiles
};
