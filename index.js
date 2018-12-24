const path = require('path');
const Generator = require('yeoman-generator');

class NpmGenerator extends Generator {
  async prompting() {
    this.answers = await this.prompt([{
      type: 'input',
      name: 'name',
      message: 'Your project name',
      default: this.appname, // Default to current folder name
    }, {
      type: 'input',
      name: 'description',
      message: 'A short description of the project',
    }, {
      type: 'confirm',
      name: 'bin',
      message: 'Would you like to create a CLI app?',
    }]);
  }

  writing() {
    const context = {
      name: this.answers.name,
      description: this.answers.description,
    };

    [
      '.editorconfig',
      '.eslintrc.js',
      '.gitattributes',
      '.gitignore',
      '.npmignore',
      '.travis.yml',
      'package.json',
      'README.md',
      path.join('src', 'index.js'),
      path.join('src', 'index.test.js'),
    ].forEach(file => this.fs.copyTpl(
      this.templatePath(file),
      this.destinationPath(file),
      context,
    ));

    if (!this.answers.bin) {
      return;
    }

    const contents = {
      bin: 'src/index.js',
    };

    this.fs.extendJSON(
      this.destinationPath('package.json'),
      contents,
    );
  }

  installDependencies() {
    this.npmInstall([
      'chai',
      'coveralls',
      'eslint',
      'eslint-config-airbnb-base',
      'eslint-plugin-import',
      'jsdoc',
      'mocha',
      'npm-run-all',
      'nyc',
      'proxyquire',
      'rimraf',
      'sinon',
      'sinon-chai',
    ], { 'save-dev': true });
  }
}

module.exports = NpmGenerator;
