var path = require('path');
var fs = require('fs');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('app', () => {
    describe('with tabs', () => {
        beforeEach(() => {
            return helpers.run(path.join(__dirname, '../app'))
                .withPrompts({
                    name: 'SomeApp',
                    companyName: 'SomeCompany',
                    indentationCharacter: 'tabs'
                });
        });

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
                'SomeApp.Tests/ProgramTest.cs'
            ]);
        });

        it('should indent Program.cs with tabs', () => {
            assert.fileContent('SomeApp/Program.cs', /\tclass Program/);
        });

        it('should have correct gitignore', () => {
            var actualData = fs.readFileSync('.gitignore', 'utf8');
            var expectedData = fs.readFileSync(path.join(__dirname, '../app/templates/_gitignore'), 'utf8');
            assert.textEqual(actualData, expectedData);
        });
    });

    describe('with spaces', () => {
        beforeEach(() => {
            return helpers.run(path.join(__dirname, '../app'))
                .withPrompts({
                    name: 'SomeApp',
                    companyName: 'SomeCompany',
                    indentationCharacter: 'spaces'
                });
        });

        it('should indent Program.cs with spaces', () => {
            assert.fileContent('SomeApp/Program.cs', /    class Program/);
        });
    });
});
