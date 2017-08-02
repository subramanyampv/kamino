# About <%= name %>

<%= name %> is a new NuGet package.

[![Build Status](https://travis-ci.org/<%= user %>/<%= name %>.svg?branch=master)](https://travis-ci.org/<%= user %>/<%= name %>)
[![Build Status](https://ci.appveyor.com/api/projects/status/<%= user %>/<%= nameToLower %>?svg=true)](https://ci.appveyor.com/project/<%= user %>/<%= nameToLower %>)
[![Coverage Status](https://coveralls.io/repos/github/<%= user %>/<%= name %>/badge.svg?branch=master)](https://coveralls.io/github/<%= user %>/<%= name %>?branch=master)
[![NuGet Status](http://nugetstatus.com/<%= name %>.png)](http://nugetstatus.com/packages/<%= name %>)

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
