'use strict';
const Generator = require('yeoman-generator');
const path = require('path');
const readdirSyncRecursive = require('./readdir');
const convertFilename = require('./filename_convert');
const buildOptions = require('./build_options');
const copier = require('./copier');

module.exports = class extends Generator {
    prompting() {
        const _this = this;
        return this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your project name',
                default: this.appname, // default to current folder name
                store: true
            },
            {
                type: 'input',
                name: 'companyName',
                message: 'Company name (for AssemblyInfo.cs copyright fields)',
                store: true
            },
            {
                type: 'list',
                name: 'indentationCharacter',
                message: 'Indentation with tabs or spaces?',
                choices: [
                    'tabs',
                    'spaces'
                ],
                default: 'spaces',
                store: true
            }
        ]).then(function(answers) {
            _this.props = answers;
        });
    }

    writing() {
        const options = buildOptions(this.props);
        const copyFn = copier.buildCopier(this.fs, options, this.props.indentationCharacter);
        const sourceRoot = this.sourceRoot();
        const files = readdirSyncRecursive(sourceRoot);
        const filenameConvertOptions = {
            name: options.name,
            templateName: 'MyApp'
        };

        files.forEach(file => {
            const relativeFile = path.relative(sourceRoot, file);
            const relativeDestination = convertFilename(relativeFile, filenameConvertOptions);
            if (path.extname(relativeFile) === '.cs') {
                copyFn(file, this.destinationPath(relativeDestination));
            } else {
                this.fs.copyTpl(
                    file,
                    this.destinationPath(relativeDestination),
                    options
                );
            }
        });
    }
};
