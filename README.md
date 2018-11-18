# dirloop
CLI utility that runs a command on multiple directories

[![Build Status](https://travis-ci.org/ngeor/dirloop.svg?branch=master)](https://travis-ci.org/ngeor/dirloop)
[![Build status](https://ci.appveyor.com/api/projects/status/k3n8te2844hk8v64/branch/master?svg=true)](https://ci.appveyor.com/project/ngeor/dirloop/branch/master)

## Typical use case

I want to run a series of git commands on multiple directories. They are all in
the same parent directory.

```
$ dirloop git gc
$ dirloop git fetch -p -t
$ dirloop git checkout -- .
$ dirloop git checkout master
$ dirloop git reset --hard origin/master
```

## Syntax

`dirloop [parameters] command [command arguments]`

### Parameters

- `dir` The parent directory. It contains the directories in which the command
  will be run. Defaults to the current directory.
- `dir-pattern` An optional wildcard pattern to select only some of the
  sub-directories.
- `dry-run` Don't actually run the command, just see what would happen.
- `help` Show help about the command
