const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('index', () => {
  describe('unscoped', () => {
    before(() => helpers.run(__dirname)
      .withPrompts({
        name: 'mylib',
        description: 'my lib is awesome',
        bin: false,
      }));

    it('should create the expected files', () => {
      assert.file([
        '.editorconfig',
        '.eslintrc.js',
        '.gitattributes',
        '.gitignore',
        '.npmignore',
        '.travis.yml',
        'package.json',
        'README.md',
        'src/index.js',
        'src/index.test.js',
      ]);
    });

    it('should have the expected package name', () => {
      assert.jsonFileContent('package.json', {
        name: 'mylib',
      });
    });
  });

  describe('scoped', () => {
    before(() => helpers.run(__dirname)
      .withPrompts({
        name: 'mylib2',
        description: 'my lib is awesome',
        scope: '@ngeor',
        bin: false,
      }));

    it('should have the expected package name', () => {
      assert.jsonFileContent('package.json', {
        name: '@ngeor/mylib2',
      });
    });
  });

  describe('cli app', () => {
    before(() => helpers.run(__dirname)
      .withPrompts({
        name: 'mylib2',
        description: 'my lib is awesome',
        bin: true,
      }));

    it('should have the expected package name', () => {
      assert.jsonFileContent('package.json', {
        name: 'mylib2',
        main: 'src/index.js',
        bin: 'src/index.js',
      });
    });
  });
});
