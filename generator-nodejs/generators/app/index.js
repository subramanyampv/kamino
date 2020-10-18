/* eslint-disable no-underscore-dangle */
const { EOL } = require('os');
const Generator = require('yeoman-generator');
const files = require('./files');

class NpmGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument('name', { type: 'string', required: false });
    this.argument('description', { type: 'string', required: false });
    this.argument('scope', { type: 'string', required: false });
    this.option('bin');
    this.argument('githubUsername', { type: 'string', required: false });
    this.argument('testFramework', { type: 'string', required: false });
  }

  async prompting() {
    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname // Default to current folder name
      },
      {
        type: 'input',
        name: 'description',
        message: 'A short description of the project'
      },
      {
        type: 'input',
        name: 'scope',
        message: 'The scope of the package (including the @ symbol)'
      },
      {
        type: 'confirm',
        name: 'bin',
        message: 'Would you like to create a CLI app?'
      },
      {
        type: 'input',
        name: 'githubUsername',
        message: 'GitHub username (for travis, coveralls, etc URLs)'
      },
      {
        type: 'list',
        name: 'testFramework',
        default: 'mocha',
        choices: [
          {
            name: 'mocha, nyc, proxyquire, chai, sinon, sinon-chai',
            value: 'mocha'
          },
          {
            name: 'jest',
            value: 'jest'
          }
        ]
      }
    ];

    const promptsWithoutOptions = prompts.filter((p) => !this.options[p.name]);
    this.answers = {
      ...this.options,
      ...await this.prompt(promptsWithoutOptions)
    };
  }

  writing() {
    const context = {
      ...this.answers,
      scopedName: this.answers.scope
        ? `${this.answers.scope}/${this.answers.name}`
        : this.answers.name,
      shebang: this.answers.bin ? `#!/usr/bin/env node${EOL}` : ''
    };

    files
      .getFiles()
      .forEach((f) => this.fs.copyTpl(
        this.templatePath(f.src),
        this.destinationPath(f.dest),
        context
      ));

    this._addBinScriptToPackageJson();
  }

  _addBinScriptToPackageJson() {
    if (!this.answers.bin) {
      return;
    }

    const contents = {
      bin: 'src/index.js'
    };

    this.fs.extendJSON(this.destinationPath('package.json'), contents);
  }

  installDependencies() {
    const testDependenciesByFramework = {
      mocha: [
        'chai',
        'mocha',
        'nyc',
        'proxyquire',
        'sinon',
        'sinon-chai'
      ],
      jest: ['jest']
    };
    const testDependencies = testDependenciesByFramework[this.answers.testFramework];

    this.npmInstall(
      [
        'coveralls',
        'eslint',
        'eslint-config-airbnb-base',
        'eslint-plugin-import',
        'jsdoc',
        'rimraf'
      ].concat(testDependencies),
      { 'save-dev': true }
    );
  }
}

module.exports = NpmGenerator;
