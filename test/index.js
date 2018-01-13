const path = require('path');
const fs = require('fs');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');

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

        /**
         * Checks if the given path is a directory.
         * @param {string} path - The path to check.
         * @returns {boolean} true if the path is a directory, false otherwise.
         */
        function isDirectory(path) {
            var s = fs.statSync(path);
            return s.isDirectory();
        }

        /**
         * Reads recursively the contents of the given directory.
         * @param {string} dirname - The path to read.
         * @returns {string[]} A collection of paths.
         */
        function readdirSyncRecursive(dirname) {
            var contents = fs.readdirSync(dirname);
            var result = [];
            contents.map(f => path.join(dirname, f)).forEach(f => {
                if (isDirectory(f)) {
                    result = result.concat(readdirSyncRecursive(f));
                } else {
                    result.push(f);
                }
            });

            return result;
        }

        class GuidHandler {
            /**
             * Checks if the file might contain GUIDs.
             * @param {string} filename - The filename to check.
             * @returns {boolean} A value indicating whether the file is expected to contain GUIDs.
             */
            shouldHandle(filename) {
                var ext = path.extname(filename);
                var basename = path.basename(filename);
                return ext === '.csproj' || ext === '.sln' || basename === 'AssemblyInfo.cs';
            }

            transformActualData(input) {
                return input.replace(
                    /[0-9a-z]{8}\-[0-9a-z]{4}\-[0-9a-z]{4}\-[0-9a-z]{4}\-[0-9a-z]{12}/ig,
                    '');
            }

            transformExpectedData(input) {
                return this.transformActualData(input);
            }
        }

        class DateHandler {
            /**
             * Checks if the file might contain the present date.
             * @param {string} filename - The filename to check.
             * @returns {boolean} A value indicating whether the file is expected to contain the present date.
             */
            shouldHandle(filename) {
                var basename = path.basename(filename);
                return basename === 'CHANGELOG.md';
            }

            transformActualData(actualData) {
                return actualData.replace(
                    new Date().toISOString().substr(0, 10),
                    '2017-08-01'); // the date of the test data
            }

            transformExpectedData(expectedData) {
                return expectedData;
            }
        }

        class YearHandler {
            /**
             * Checks if the file might contain the present year.
             * @param {string} filename - The filename to check.
             * @returns {boolean} A value indicating whether the file is expected to contain the present year.
             */
            shouldHandle(filename) {
                var basename = path.basename(filename);
                return basename === 'AssemblyInfo.cs';
            }

            transformActualData(actualData) {
                return actualData.replace(
                    new Date().toISOString().substr(0, 4),
                    '2017'); // the year of the test data
            }

            transformExpectedData(expectedData) {
                return expectedData;
            }
        }

        function templateTests() {
            var expectedDataDirectory = path.join(__dirname, 'data');
            var expectedFiles = readdirSyncRecursive(expectedDataDirectory)
                .map(f => path.relative(expectedDataDirectory, f));
            const handlers = [
                new GuidHandler(),
                new DateHandler(),
                new YearHandler()
            ];
            expectedFiles.forEach(fixtureFile => {
                var sourceFile = fixtureFile;
                var destFile = fixtureFile.replace('_', '.');
                it(`should map ${sourceFile} to ${destFile}`, () => {
                    var actualData = fs.readFileSync(destFile, 'utf8');
                    var expectedData = fs.readFileSync(path.join(expectedDataDirectory, sourceFile), 'utf8');
                    for (let index = 0; index < handlers.length; index++) {
                        const handler = handlers[index];
                        if (handler.shouldHandle(sourceFile)) {
                            actualData = handler.transformActualData(actualData);
                            expectedData = handler.transformExpectedData(expectedData);
                        }
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
