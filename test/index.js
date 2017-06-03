var helpers = require('yeoman-test');
var path = require('path');
var assert = require('yeoman-assert');

describe('app', () => {
    beforeEach(() => {
        return helpers.run(path.join(__dirname, '../app'))
            .withPrompts({
                name: 'SomeApp',
                companyName: 'SomeCompany'
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
});
