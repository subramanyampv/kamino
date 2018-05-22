# About <%= name %>

<%= name %> is a new NuGet package.

[![Build Status](https://travis-ci.org/<%= user %>/<%= name %>.svg?branch=master)](https://travis-ci.org/<%= user %>/<%= name %>)
[![NuGet](https://img.shields.io/nuget/v/<%= name %>.svg)](https://www.nuget.org/packages/<%= name %>/)
[![NuGet](https://img.shields.io/nuget/dt/<%= name %>.svg)](https://www.nuget.org/packages/<%= name %>/)

## Release Process

To create a new release:

- Make sure the version is correct in the csproj file
- Prepare changelog so that items listed in `Unreleased` are moved to the new version
- Push changes to master
- Create a tag
- Push the tag
