'use strict';
var yeoman = require('yeoman-generator');
var uuid = require('node-uuid');

module.exports = yeoman.generators.Base.extend({
	prompting: function() {
		var done = this.async();
		this.prompt([
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
			}
		], function(answers) {
			this.props = answers;
			done();
		}.bind(this));
	},

	writing: function() {
		var name = this.props.name;
		var testName = name + '.Tests';
		var options = {
				name: name,
				testName: testName,
				companyName: this.props.companyName,
				cliUUID: uuid.v1().toUpperCase(),
				nugetUUID: uuid.v1().toUpperCase(),
				testsUUID: uuid.v1().toUpperCase()
			};

		// copy .gitignore
		this.fs.copy(
			this.templatePath('_gitignore'),
			this.destinationPath('.gitignore'));

		// copy .nuget folder
		this.fs.copy(
			this.templatePath('_nuget'),
			this.destinationPath('.nuget'));

		// copy solution file
		this.fs.copyTpl(
			this.templatePath('MyApp.sln'),
			this.destinationPath(name + '.sln'),
			options);

		// copy packages/repositories.config
		this.fs.copyTpl(
			this.templatePath('packages/repositories.config'),
			this.destinationPath('packages/repositories.config'),
			options);

		// copy MyApp *.cs files
		this.fs.copyTpl(
			this.templatePath('MyApp/**/*.cs'),
			this.destinationPath(name),
			options);

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
		this.fs.copyTpl(
			this.templatePath('MyApp.Tests/**/*.cs'),
			this.destinationPath(testName),
			options);

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
});
