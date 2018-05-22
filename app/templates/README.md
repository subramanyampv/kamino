# About <%= name %>

<%= name %> is a new NuGet package.

[![Build Status](https://travis-ci.org/<%= user %>/<%= name %>.svg?branch=master)](https://travis-ci.org/<%= user %>/<%= name %>)
[![NuGet Status](http://nugetstatus.com/<%= name %>.png)](http://nugetstatus.com/packages/<%= name %>)

## Release Process

To create a new release:

- Make sure the following files are aligned:
  - `AssemblyInfo.cs`
  - `nuspec file`
- Prepare changelog so that items listed in `Unreleased` are moved to the new version
- Push changes to master
- Create a tag
- Push the tag
