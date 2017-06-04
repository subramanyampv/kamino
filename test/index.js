var helpers = require('yeoman-test');
var path = require('path');
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

                '.nuget/NuGet.Config',
                '.nuget/NuGet.exe',
                '.nuget/NuGet.targets',

                'packages/repositories.config',

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
