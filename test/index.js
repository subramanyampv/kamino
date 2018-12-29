/* eslint-disable class-methods-use-this */
const path = require('path');
const fs = require('fs');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const filenameConvert = require('../app/filename_convert');
const readdirSyncRecursive = require('../app/readdir');

describe('app', () => {
  describe('files', () => {
    beforeEach(() => helpers.run(path.join(__dirname, '../app'))
      .withPrompts({
        name: 'SomeApp',
        companyName: 'SomeCompany',
        indentationCharacter: 'spaces',
      }));

    it('should generate expected files', () => {
      assert.file([
        '.gitignore',

        'SomeApp.sln',

        'SomeApp/SomeApp.csproj',
        'SomeApp/Properties/AssemblyInfo.cs',
        'SomeApp/App.config',
        'SomeApp/packages.config',
        'SomeApp/Program.cs',

        'SomeApp.Tests/SomeApp.Tests.csproj',
        'SomeApp.Tests/Properties/AssemblyInfo.cs',
        'SomeApp.Tests/packages.config',
        'SomeApp.Tests/ProgramTest.cs',
      ]);
    });

    /**
         * Removes GUIDs from files.
         */
    class GuidHandler {
      /**
       * Checks if the file might contain GUIDs.
       * @param {string} filename - The filename to check.
       * @returns {boolean} A value indicating whether the file is expected to contain GUIDs.
       */
      shouldHandle(filename) {
        const ext = path.extname(filename);
        const basename = path.basename(filename);
        return ext === '.csproj' || ext === '.sln' || basename === 'AssemblyInfo.cs';
      }

      transformActualData(input) {
        return input.replace(
          /[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/ig,
          '',
        );
      }

      transformExpectedData(input) {
        return this.transformActualData(input);
      }
    }

    /**
     * Sets all dates to the same value.
     */
    class DateHandler {
      /**
       * Checks if the file might contain the present date.
       * @param {string} filename - The filename to check.
       * @returns {boolean} A value indicating whether the file is expected
       *                    to contain the present date.
       */
      shouldHandle(filename) {
        const basename = path.basename(filename);
        return basename === 'CHANGELOG.md';
      }

      transformActualData(actualData) {
        return actualData.replace(
          new Date().toISOString().substr(0, 10),
          '2017-08-01',
        ); // the date of the test data
      }

      transformExpectedData(expectedData) {
        return expectedData;
      }
    }

    /**
     * Sets all years to the same value.
     */
    class YearHandler {
      /**
       * Checks if the file might contain the present year.
       * @param {string} filename - The filename to check.
       * @returns {boolean} A value indicating whether the file is expected
       *                    to contain the present year.
       */
      shouldHandle(filename) {
        const basename = path.basename(filename);
        return basename === 'AssemblyInfo.cs';
      }

      transformActualData(actualData) {
        return actualData.replace(
          new Date().toISOString().substr(0, 4),
          '2017',
        ); // the year of the test data
      }

      transformExpectedData(expectedData) {
        return expectedData;
      }
    }

    /**
     * Creates one unit test per file.
     */
    function templateTests() {
      const expectedDataDirectory = path.join(__dirname, 'data');
      const expectedFiles = readdirSyncRecursive(expectedDataDirectory)
        .map(f => path.relative(expectedDataDirectory, f));
      const handlers = [
        new GuidHandler(),
        new DateHandler(),
        new YearHandler(),
      ];
      expectedFiles.forEach((fixtureFile) => {
        const sourceFile = fixtureFile;
        const destFile = filenameConvert(fixtureFile);
        it(`should map ${sourceFile} to ${destFile}`, () => {
          let actualData = fs.readFileSync(destFile, 'utf8');
          let expectedData = fs.readFileSync(
            path.join(expectedDataDirectory, sourceFile), 'utf8',
          );
          for (let index = 0; index < handlers.length; index += 1) {
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
    beforeEach(() => helpers.run(path.join(__dirname, '../app'))
      .withPrompts({
        name: 'SomeApp',
        companyName: 'SomeCompany',
        indentationCharacter: 'tabs',
      }));

    it('should indent Program.cs with spaces', () => {
      assert.fileContent('SomeApp/Program.cs', /\tclass Program/);
    });
  });

  describe('with spaces', () => {
    beforeEach(() => helpers.run(path.join(__dirname, '../app'))
      .withPrompts({
        name: 'SomeApp',
        companyName: 'SomeCompany',
        indentationCharacter: 'spaces',
      }));

    it('should indent Program.cs with spaces', () => {
      assert.fileContent('SomeApp/Program.cs', / {4}class Program/);
    });
  });
});
