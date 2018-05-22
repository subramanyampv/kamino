# generator-csharp-nuget-lib
Yeoman generator for a C# library that publishes a NuGet package. Includes a unit test project.

[![npm version](https://img.shields.io/npm/v/generator-csharp-nuget-lib.svg)](https://npmjs.org/package/generator-csharp-nuget-lib)
[![Build Status](https://travis-ci.org/ngeor/generator-csharp-nuget-lib.svg?branch=master)](https://travis-ci.org/ngeor/generator-csharp-nuget-lib)
[![Coverage Status](https://coveralls.io/repos/github/ngeor/generator-csharp-nuget-lib/badge.svg?branch=master)](https://coveralls.io/github/ngeor/generator-csharp-nuget-lib?branch=master)
[![Dependencies Status](https://david-dm.org/ngeor/generator-csharp-nuget-lib.svg)](https://david-dm.org/ngeor/generator-csharp-nuget-lib)
[![devDependencies Status](https://david-dm.org/ngeor/generator-csharp-nuget-lib/dev-status.svg)](https://david-dm.org/ngeor/generator-csharp-nuget-lib?type=dev)

## Usage

Install with `npm install -g yo generator-csharp-nuget-lib`.

Run with `yo csharp-nuget-lib`.

It will create a new .NET solution consisting of a NuGet library project and a unit test project.

Some details:

- .NET Core 2
- NUnit and Moq for the test project
- Configuration for Travis

## Contributing

- Scaffold data is indented with tabs, test data is indented with spaces.

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
