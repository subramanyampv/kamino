# About SomeLib

SomeLib is a new NuGet package.

[![Build Status](https://travis-ci.org/githubuser/SomeLib.svg?branch=master)](https://travis-ci.org/githubuser/SomeLib)
[![Build Status](https://ci.appveyor.com/api/projects/status/githubuser/somelib?svg=true)](https://ci.appveyor.com/project/githubuser/somelib)
[![Coverage Status](https://coveralls.io/repos/github/githubuser/SomeLib/badge.svg?branch=master)](https://coveralls.io/github/githubuser/SomeLib?branch=master)
[![NuGet Status](http://nugetstatus.com/SomeLib.png)](http://nugetstatus.com/packages/SomeLib)

## Release Process

To create a new release:

- Make sure the following files are aligned:
  - `AssemblyInfo.cs`
  - `nuspec file`
  - `appveyor.yml`
- Prepare changelog so that items listed in `Unreleased` are moved to the new version
- Push changes to master
- Create a tag
- Push the tag

## Documentation

You can generate the API documentation with: `docfx .\docfx_project\docfx.json --serve`. See more
information at [docfx](https://dotnet.github.io/docfx/index.html).
