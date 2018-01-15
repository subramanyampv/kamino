'use strict';
const Generator = require('yeoman-generator');
const ejs = require('ejs');
const path = require('path');
const readdirSyncRecursive = require('./readdir');
const convertFilename = require('./filename_convert');
const buildOptions = require('./build_options');

/**
 * Returns the parameter unchanged.
 * Used when a file is already indented with tabs.
 * @param {string} contents The file contents.
 * @returns {string} The new file contents.
 */
function noop(contents) {
    return contents;
}

/**
 * Converts tabs to spaces.
 * @param {string} contents The file contents.
 * @returns {string} The new file contents.
 */
function tabsToSpaces(contents) {
    return contents.replace(/\t/g, '    ');
}

/**
 * Renders the given ejs template in the given context.
 * @param {string} contents The ejs template.
 * @param {*} context The context available during template rendering.
 * @returns {string} The rendered content.
 */
function ejsProcessor(contents, context) {
    return ejs.render(contents, context);
}

/**
 * Builds the processor function.
 * First the file is converted to spaces if needed, then it is rendered with ejs.
 * @param {string} indentationCharacter The indentation character ('tabs' or 'spaces').
 * @param {*} context The context available during template rendering.
 * @returns {function} The processor function.
 */
function buildProcessor(indentationCharacter, context) {
    const fn = indentationCharacter === 'tabs' ? noop : tabsToSpaces;
    return (contents) => ejsProcessor(fn(contents.toString()), context);
}

/**
 * Builds the copier function.
 * @param {*} fs The filesystem.
 * @param {*} context The context available during template rendering.
 * @param {string} indentationCharacter The indentation character ('tabs' or 'spaces').
 * @returns {function} The copier function.
 */
function buildCopier(fs, context, indentationCharacter) {
    const process = buildProcessor(indentationCharacter, context);
    return (from, to) => fs.copy(from, to, { process });
}

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
            },
            {
                type: 'input',
                name: 'user',
                message: 'GitHub username (for badges, URLs, etc)',
                store: true
            },
            {
                type: 'input',
                name: 'version',
                message: 'Semantic version',
                default: '0.1.0',
                store: true
            }
        ]).then(function(answers) {
            _this.props = answers;
        });
    }

    writing() {
        const options = buildOptions(this.props);
        const copyFn = buildCopier(this.fs, options, this.props.indentationCharacter);
        const sourceRoot = this.sourceRoot();
        const files = readdirSyncRecursive(sourceRoot);
        const filenameConvertOptions = {
            name: options.name,
            templateName: 'MyLib'
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
