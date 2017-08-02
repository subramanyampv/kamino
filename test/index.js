var path = require('path');
var fs = require('fs');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('app', () => {
    describe('files', () => {
        beforeEach(() => {
            return helpers.run(path.join(__dirname, '../app'))
                .withPrompts({
                    name: 'SomeLib',
                    companyName: 'SomeCompany',
                    indentationCharacter: 'spaces',
                    user: 'githubuser'
                });
        });

        it('should generate expected files', () => {
            assert.file([
                '.gitignore',
                '.travis.yml',
                'appveyor.yml',
                'CHANGELOG.md',
                'coverage.ps1',
                'README.md',

                'SomeLib.sln',

                'SomeLib/SomeLib.csproj',
                'SomeLib/SomeLib.nuspec',
                'SomeLib/Properties/AssemblyInfo.cs',
                'SomeLib/packages.config',
                'SomeLib/Class1.cs',

                'SomeLib.Tests/SomeLib.Tests.csproj',
                'SomeLib.Tests/Properties/AssemblyInfo.cs',
                'SomeLib.Tests/packages.config',
                'SomeLib.Tests/Class1Test.cs'
            ]);
        });

        function isDirectory(path) {
            var s = fs.statSync(path);
            return s.isDirectory();
        }

        function readdirSyncRecursive(dirname) {
            var result = fs.readdirSync(dirname);
            var t = [];
            result.map(f => path.join(dirname, f)).forEach(f => {
                if (isDirectory(f)) {
                    t = t.concat(readdirSyncRecursive(f));
                } else {
                    t.push(f);
                }
            });

            return t;
        }

        function removeGuids(input) {
            return input.replace(
                /[0-9a-z]{8}\-[0-9a-z]{4}\-[0-9a-z]{4}\-[0-9a-z]{4}\-[0-9a-z]{12}/ig,
                '');
        }

        /**
         * Checks if the file might contain GUIDs.
         * @param {string} filename - The filename to check.
         * @returns {boolean} A value indicating whether the file is expected to contain GUIDs.
         */
        function expectedToContainGuids(filename) {
            var ext = path.extname(filename);
            var basename = path.basename(filename);
            return ext === '.csproj' || ext === '.sln' || basename === 'AssemblyInfo.cs';
        }

        /**
         * Checks if the file might contain the present date.
         * @param {string} filename - The filename to check.
         * @returns {boolean} A value indicating whether the file is expected to contain the present date.
         */
        function expectedToContainDate(filename) {
            var basename = path.basename(filename);
            return basename === 'CHANGELOG.md';
        }

        function templateTests() {
            var expectedDataDirectory = path.join(__dirname, 'data');
            var expectedFiles = readdirSyncRecursive(expectedDataDirectory)
                .map(f => path.relative(expectedDataDirectory, f));
            expectedFiles.forEach(fixtureFile => {
                var sourceFile = fixtureFile;
                var destFile = fixtureFile.replace('_', '.');
                it(`should map ${sourceFile} to ${destFile}`, () => {
                    var actualData = fs.readFileSync(destFile, 'utf8');
                    var expectedData = fs.readFileSync(path.join(expectedDataDirectory, sourceFile), 'utf8');

                    if (expectedToContainGuids(sourceFile)) {
                        actualData = removeGuids(actualData);
                        expectedData = removeGuids(expectedData);
                    }

                    if (expectedToContainDate(sourceFile)) {
                        actualData = actualData.replace(
                            new Date().toISOString().substr(0, 10),
                            '2017-08-01'); // the date of the test data
                    }

                    assert.textEqual(actualData, expectedData);
                });
            });
        }

        templateTests();
    });

    describe('with tabs', () => {
        beforeEach(() => {
            return helpers.run(path.join(__dirname, '../app'))
                .withPrompts({
                    name: 'SomeLib',
                    companyName: 'SomeCompany',
                    indentationCharacter: 'tabs'
                });
        });

        it('should indent Class1.cs with tabs', () => {
            assert.fileContent('SomeLib/Class1.cs', /\tpublic class Class1/);
        });
    });

    describe('with spaces', () => {
        beforeEach(() => {
            return helpers.run(path.join(__dirname, '../app'))
                .withPrompts({
                    name: 'SomeLib',
                    companyName: 'SomeCompany',
                    indentationCharacter: 'spaces'
                });
        });

        it('should indent Class1.cs with spaces', () => {
            assert.fileContent('SomeLib/Class1.cs', /    public class Class1/);
        });
    });
});
