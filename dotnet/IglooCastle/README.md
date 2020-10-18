IglooCastle
===========

Documentation generator for .NET projects.

[![Build Status](https://travis-ci.org/ngeor/IglooCastle.svg?branch=master)](https://travis-ci.org/ngeor/IglooCastle)
[![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/536gkiekjk3570c5?svg=true)](https://ci.appveyor.com/project/ngeor/igloocastle)
[![Coverage Status](https://coveralls.io/repos/github/ngeor/IglooCastle/badge.svg?branch=master)](https://coveralls.io/github/ngeor/IglooCastle?branch=master)

**Project is not maintained. Use [DocFX](https://dotnet.github.io/docfx/index.html) instead.**

Run with:

    IglooCastle assembly1.dll assembly2.dll [--output=outputDirectory]

By default it generates the documentation in the current
folder, you can specify it explicitly with --output.

If you don't specify any assemblies, it will generate the
documentation for IglooCastle itself.
