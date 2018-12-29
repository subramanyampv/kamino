/* eslint-disable no-underscore-dangle */
const { EOL } = require('os');
const Generator = require('yeoman-generator');
const files = require('./files');

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
      type: 'input',
      name: 'scope',
      message: 'The scope of the package (including the @ symbol)',
    }, {
      type: 'confirm',
      name: 'bin',
      message: 'Would you like to create a CLI app?',
    }]);
  }

  writing() {
    const context = {
      name: this.answers.name,
      scopedName: this.answers.scope ? `${this.answers.scope}/${this.answers.name}` : this.answers.name,
      description: this.answers.description,
      shebang: this.answers.bin ? `#!/usr/bin/env node${EOL}` : '',
    };

    files.getFiles().forEach(f => this.fs.copyTpl(
      this.templatePath(f.src),
      this.destinationPath(f.dest),
      context,
    ));

    this._addBinScriptToPackageJson();
  }

  _addBinScriptToPackageJson() {
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
      'nyc',
      'proxyquire',
      'rimraf',
      'sinon',
      'sinon-chai',
    ], { 'save-dev': true });
  }
}

module.exports = NpmGenerator;
