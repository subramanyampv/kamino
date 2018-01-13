'use strict';
const Generator = require('yeoman-generator');
const uuid = require('uuid');
const ejs = require('ejs');
const path = require('path');
const readdirSyncRecursive = require('./readdir');
const convertFilename = require('./filename_convert');

/**
 * Returns the parameter unchanged.
 * Used when a file is already indented with tabs.
 * @param {String} contents The file contents.
 * @returns {String} The new file contents.
 */
function noop(contents) {
    return contents;
}

/**
 * Converts tabs to spaces.
 * @param {String} contents The file contents.
 * @returns {String} The new file contents.
 */
function tabsToSpaces(contents) {
    return contents.replace(/\t/g, '    ');
}

/**
 * Renders the given ejs template in the given context.
 * @param {String} contents The ejs template.
 * @param {*} context The context available during template rendering.
 * @returns {String} The rendered content.
 */
function ejsProcessor(contents, context) {
    return ejs.render(contents, context);
}

/**
 * Builds the processor function.
 * First the file is converted to spaces if needed, then it is rendered with ejs.
 * @param {String} indentationCharacter The indentation character ('tabs' or 'spaces').
 * @param {*} context The context available during template rendering.
 * @returns {Function} The processor function.
 */
function buildProcessor(indentationCharacter, context) {
    var fn = indentationCharacter === 'tabs' ? noop : tabsToSpaces;
    return (contents) => ejsProcessor(fn(contents.toString()), context);
}

/**
 * Builds the copier function.
 * @param {*} fs The filesystem.
 * @param {*} context The context available during template rendering.
 * @param {String} indentationCharacter The indentation character ('tabs' or 'spaces').
 * @returns {Function} The copier function.
 */
function buildCopier(fs, context, indentationCharacter) {
    return (from, to) => fs.copy(from, to, {
        process: buildProcessor(indentationCharacter, context)
    });
}

module.exports = class extends Generator {
    prompting() {
        var _this = this;
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
        var name = this.props.name;
        var testName = name + '.Tests';
        var now = (new Date()).toISOString();
        var year = now.substr(0, 4);
        var date = now.substr(0, 10);

        var options = {
            name: name,
            nameToLower: name.toLowerCase(),
            testName: testName,
            user: this.props.user,
            companyName: this.props.companyName,
            libUUID: uuid.v1().toUpperCase(),
            solutionFilesUUID: uuid.v1().toUpperCase(),
            testsUUID: uuid.v1().toUpperCase(),
            now: date,
            year: year,
            version: this.props.version
        };

        var copyFn = buildCopier(this.fs, options, this.props.indentationCharacter);
        const sourceRoot = this.sourceRoot();
        const files = readdirSyncRecursive(sourceRoot);
        files.forEach(file => {
            const relativeFile = path.relative(sourceRoot, file);
            const relativeDestination = convertFilename(relativeFile, options);
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
