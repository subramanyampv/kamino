'use strict';
const Generator = require('yeoman-generator');
const uuid = require('uuid');
const ejs = require('ejs');

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
            }
        ]).then(function(answers) {
            _this.props = answers;
        });
    }

    writing() {
        const name = this.props.name;
        const testName = name + '.Tests';
        const options = {
            name,
            testName,
            companyName: this.props.companyName,
            cliUUID: uuid.v1().toUpperCase(),
            solutionFilesUUID: uuid.v1().toUpperCase(),
            testsUUID: uuid.v1().toUpperCase()
        };

        const copyFn = buildCopier(this.fs, options, this.props.indentationCharacter);

        // copy .gitignore
        this.fs.copyTpl(
            this.templatePath('_gitignore'),
            this.destinationPath('.gitignore'),
            options);

        // copy .travis.yml
        this.fs.copyTpl(
            this.templatePath('_travis.yml'),
            this.destinationPath('.travis.yml'),
            options);

        // copy solution file
        this.fs.copyTpl(
            this.templatePath('MyApp.sln'),
            this.destinationPath(name + '.sln'),
            options);

        // copy MyApp *.cs files
        copyFn(
            this.templatePath('MyApp/**/*.cs'),
            this.destinationPath(name)
        );

        // copy MyApp *.config files
        this.fs.copyTpl(
            this.templatePath('MyApp/**/*.config'),
            this.destinationPath(name),
            options);

        // copy MyApp.csproj file
        this.fs.copyTpl(
            this.templatePath('MyApp/MyApp.csproj'),
            this.destinationPath(name + '/' + name + '.csproj'),
            options);

        // copy MyApp.Tests *.cs files
        copyFn(
            this.templatePath('MyApp.Tests/**/*.cs'),
            this.destinationPath(testName)
        );

        // copy MyApp.Tests *.config files
        this.fs.copyTpl(
            this.templatePath('MyApp.Tests/**/*.config'),
            this.destinationPath(testName),
            options);

        // copy MyApp.Tests.csproj file
        this.fs.copyTpl(
            this.templatePath('MyApp.Tests/MyApp.Tests.csproj'),
            this.destinationPath(testName + '/' + testName + '.csproj'),
            options);
    }
};
