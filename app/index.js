'use strict';
var Generator = require('yeoman-generator');
var uuid = require('uuid');
var ejs = require('ejs');

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

module.exports = Generator.extend({
    prompting: function() {
        var _this = this;
        return this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your project name',
                default: this.appname // default to current folder name
            },
            {
                type: 'input',
                name: 'companyName',
                message: 'Company name (for AssemblyInfo.cs copyright fields)'
            },
            {
                type: 'list',
                name: 'indentationCharacter',
                message: 'Indentation with tabs or spaces?',
                choices: [
                    'tabs',
                    'spaces'
                ],
                default: 'spaces'
            },
            {
                type: 'input',
                name: 'user',
                message: 'GitHub username (for badges, URLs, etc)'
            },
            {
                type: 'input',
                name: 'version',
                message: 'Semantic version',
                default: '0.1.0'
            }
        ]).then(function(answers) {
            _this.props = answers;
        });
    },

    writing: function() {
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

        // copy .gitignore
        this.fs.copyTpl(
            this.templatePath('_gitignore'),
            this.destinationPath('.gitignore'),
            options);

        this.fs.copyTpl(
            this.templatePath('_travis.yml'),
            this.destinationPath('.travis.yml'),
            options);

        ['appveyor.yml', 'CHANGELOG.md', 'coverage.ps1', 'README.md'].forEach(f => {
            this.fs.copyTpl(
                this.templatePath(f),
                this.destinationPath(f),
                options
            );
        });

        // copy solution file
        this.fs.copyTpl(
            this.templatePath('MyLib.sln'),
            this.destinationPath(name + '.sln'),
            options);

        // copy MyLib *.cs files
        copyFn(
            this.templatePath('MyLib/**/*.cs'),
            this.destinationPath(name)
        );

        // copy MyLib *.config files
        this.fs.copyTpl(
            this.templatePath('MyLib/**/*.config'),
            this.destinationPath(name),
            options);

        // copy MyLib.csproj file
        this.fs.copyTpl(
            this.templatePath('MyLib/MyLib.csproj'),
            this.destinationPath(name + '/' + name + '.csproj'),
            options);

        // copy MyLib.nuspec file
        this.fs.copyTpl(
            this.templatePath('MyLib/MyLib.nuspec'),
            this.destinationPath(name + '/' + name + '.nuspec'),
            options);

        // copy MyLib.Tests *.cs files
        copyFn(
            this.templatePath('MyLib.Tests/**/*.cs'),
            this.destinationPath(testName)
        );

        // copy MyLib.Tests *.config files
        this.fs.copyTpl(
            this.templatePath('MyLib.Tests/**/*.config'),
            this.destinationPath(testName),
            options);

        // copy MyLib.Tests.csproj file
        this.fs.copyTpl(
            this.templatePath('MyLib.Tests/MyLib.Tests.csproj'),
            this.destinationPath(testName + '/' + testName + '.csproj'),
            options);
    }
});
