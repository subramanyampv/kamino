const path = require('path');

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
    path.join('src', 'index.test.js'),
  ];

  return files.map((f) => ({
    src: f,
    dest: mapLeadingUnderscore(f),
  }));
}

module.exports = {
  getFiles,
};
