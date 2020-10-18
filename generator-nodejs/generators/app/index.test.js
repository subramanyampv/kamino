const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('index', () => {
  describe('unscoped', () => {
    before(() => helpers.run(__dirname)
      .withPrompts({
        name: 'mylib',
        description: 'my lib is awesome',
        bin: false,
        githubUsername: 'ngeor',
        testFramework: 'mocha'
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
        'src/index.test.js'
      ]);
    });

    it('should have the expected package name', () => {
      assert.jsonFileContent('package.json', {
        name: 'mylib'
      });
    });

    it('should have the expected scripts', () => {
      assert.jsonFileContent('package.json', {
        scripts: {
          pretest: 'eslint .',
          test: 'nyc mocha src/*.test.js src/**/*test.js',
          postversion: 'git push --follow-tags',
          eslint: 'eslint .',
          mocha: 'mocha src/*.test.js src/**/*test.js',
          nyc: 'nyc mocha src/*.test.js src/**/*test.js'
        }
      });
    });

    it('should not add shebang on the main file', () => {
      assert.fileContent('src/index.js', /^function add/);
    });
  });

  describe('scoped', () => {
    before(() => helpers.run(__dirname)
      .withPrompts({
        name: 'mylib2',
        description: 'my lib is awesome',
        scope: '@ngeor',
        bin: false,
        githubUsername: 'ngeor',
        testFramework: 'mocha'
      }));

    it('should have the expected package name', () => {
      assert.jsonFileContent('package.json', {
        name: '@ngeor/mylib2'
      });
    });
  });

  describe('cli app', () => {
    before(() => helpers.run(__dirname)
      .withPrompts({
        name: 'mylib2',
        description: 'my lib is awesome',
        bin: true,
        githubUsername: 'ngeor',
        testFramework: 'mocha'
      }));

    it('should have the expected package name', () => {
      assert.jsonFileContent('package.json', {
        name: 'mylib2',
        main: 'src/index.js',
        bin: 'src/index.js'
      });
    });

    it('should have the shebang on the main file', () => {
      assert.fileContent('src/index.js', /^#!\/usr\/bin\/env node\s+function/);
    });
  });

  describe('using jest', () => {
    before(() => helpers.run(__dirname)
      .withPrompts({
        name: 'mylib',
        description: 'my lib is awesome',
        bin: false,
        githubUsername: 'ngeor',
        testFramework: 'jest'
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
        'src/index.test.js'
      ]);
    });

    it('should have the expected package name', () => {
      assert.jsonFileContent('package.json', {
        name: 'mylib'
      });
    });

    it('should have the expected scripts', () => {
      assert.jsonFileContent('package.json', {
        scripts: {
          pretest: 'eslint .',
          test: 'jest',
          postversion: 'git push --follow-tags',
          eslint: 'eslint .'
        }
      });
    });
  });
});
