# dirloop

CLI utility that runs a command on multiple directories

[![Build Status](https://travis-ci.org/ngeor/dirloop.svg?branch=master)](https://travis-ci.org/ngeor/dirloop)

## Typical use case

I want to run a series of git commands on multiple directories. They are all in
the same parent directory.

```
$ node dirloop.js git gc
$ node dirloop.js git fetch -p -t
$ node dirloop.js git checkout -- .
$ node dirloop.js git checkout master
$ node dirloop.js git reset --hard origin/master
```

## Syntax

`node dirloop.js [parameters] command [command arguments]`

### Parameters

- `dir` The parent directory. It contains the directories in which the command
  will be run. Defaults to the current directory.
- `dir-prefix` An optional prefix to select only some of the
  sub-directories.
- `dry-run` Don't actually run the command, just see what would happen.
- `help` Show help about the command
