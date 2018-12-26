dirloop
=========

CLI utility that runs a command on multiple directories

[![Build Status](https://travis-ci.org/ngeor/dirloop.svg?branch=master)](https://travis-ci.org/ngeor/dirloop)
[![npm (scoped)](https://img.shields.io/npm/v/@ngeor/dirloop.svg)](https://www.npmjs.com/package/@ngeor/dirloop)
[![Coverage Status](https://coveralls.io/repos/github/ngeor/dirloop/badge.svg)](https://coveralls.io/github/ngeor/dirloop)
[![Dependencies](https://david-dm.org/ngeor/dirloop.svg)](https://david-dm.org/ngeor/dirloop)
[![devDependencies Status](https://david-dm.org/ngeor/dirloop/dev-status.svg)](https://david-dm.org/ngeor/dirloop?type=dev)

## Installation

dirloop requires nodeJS 10+.

You can install dirloop with `npm i -g @ngeor/dirloop`. In that case, you can invoke it with `dirloop`.

You can also use it without installation with `npx @ngeor/dirloop`.

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

(or `npx @ngeor/dirloop` if you don't want to install it)

## Parameters

#### `--help`

Show help about the command.

#### `--dir <dir>`

The parent directory. It contains the directories in which the command
will be run. Defaults to the current directory.

### Filtering Parameters

#### `--dir-prefix <prefix1>,<prefix2>`

An optional set of prefixes, in order to select only some of the
sub-directories (e.g. `--dir-prefix app`, `--dir-prefix src,test`).

#### `--has-file <filename>`

Only match directories that contain this filename (e.g. `--has-file package.json`).

#### `--eval-js <nodejs-script>`

Only match directories in which the given nodeJS script evaluates
successfully.

Example:

```
--eval-js "var x = JSON.parse(fs.readFileSync('package.json')); process.exitCode = x.devDependencies['chai'] ? 1 : 0"
```

will match directories that do not use the `chai` dev dependency.


### Execution Parameters

#### `--dry-run`

Don't actually run the command, just see what would happen.

#### `--no-shell`

Do not run the command inside a shell process.

##  Without command

If you don't specify the command to run, dirloop will print the matching directories (absolute paths).
