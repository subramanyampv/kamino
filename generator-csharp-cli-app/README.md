# generator-csharp-cli-app

[![npm version](https://img.shields.io/npm/v/generator-csharp-cli-app.svg)](https://npmjs.org/package/generator-csharp-cli-app)
[![Build Status](https://travis-ci.org/ngeor/generator-csharp-cli-app.svg?branch=master)](https://travis-ci.org/ngeor/generator-csharp-cli-app)
[![Coverage Status](https://coveralls.io/repos/github/ngeor/generator-csharp-cli-app/badge.svg?branch=master)](https://coveralls.io/github/ngeor/generator-csharp-cli-app?branch=master)
[![Dependencies Status](https://david-dm.org/ngeor/generator-csharp-cli-app.svg)](https://david-dm.org/ngeor/generator-csharp-cli-app)
[![devDependencies Status](https://david-dm.org/ngeor/generator-csharp-cli-app/dev-status.svg)](https://david-dm.org/ngeor/generator-csharp-cli-app?type=dev)

Yeoman generator for a C# command line app with log4net and unit tests.

## Installation

You can install via npm:

	npm install -g generator-csharp-cli-app

## Usage

Create a folder named after the project you want to create, e.g. MyApp. Inside that folder, run:

	yo csharp-cli-app

You will be asked to enter:

- the project name (by default it is the folder name you're in)
- the company name (it will be added in the AssemblyInfo.cs files)
- if you want to use tabs or spaces for indentation of the generated files

This command will create a Visual Studio solution that consists of a console application and an NUnit class library for unit tests.

In the following example you can get an idea of the files and folders you end up with.

	ngeor@box-CP6230:~$ mkdir MyApp
	ngeor@box-CP6230:~$ cd MyApp/
	ngeor@box-CP6230:~/MyApp$ yo csharp-cli-app
	? Your project name: MyApp
	? Company name (for AssemblyInfo.cs copyright fields) My Company
	   create .gitignore
	   create MyApp.sln
	   create MyApp/Program.cs
	   create MyApp/Properties/AssemblyInfo.cs
	   create MyApp/App.config
	   create MyApp/packages.config
	   create MyApp/MyApp.csproj
	   create MyApp.Tests/ProgramTest.cs
	   create MyApp.Tests/Properties/AssemblyInfo.cs
	   create MyApp.Tests/packages.config
	   create MyApp.Tests/MyApp.Tests.csproj

What you'll also get:

- A `.gitignore` file
- log4net for both the console app and the test library
- NUnit and Moq for the test library
- the console app internals are visible to the test library
- the copyright information is filled in in the AssemblyInfo.cs files

## Development

### Developing

You can run `npm link` from the working directory of the repository to develop this generator,
and `npm unlink` once you're finished.

The default test command invokes `gulp`.

### Release Process

To create a new release:

- Make sure the version is correct in `package.json` and `package-lock.json`
- Prepare changelog so that items listed in `Unreleased` are moved to the new version
- Push changes to master
- Create a tag
- Push the tag

