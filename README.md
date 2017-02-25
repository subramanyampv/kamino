clone-all
=========

Automatically clone all your GitHub repositories.

[![Build Status](https://travis-ci.org/ngeor/clone-all.svg?branch=master)](https://travis-ci.org/ngeor/clone-all)
[![Dependencies](https://david-dm.org/ngeor/clone-all.svg)](https://david-dm.org/ngeor/clone-all)
[![Coverage Status](https://coveralls.io/repos/github/ngeor/clone-all/badge.svg)](https://coveralls.io/github/ngeor/clone-all)

Requirements
------------

This is a simple script that requires [Node.js](http://nodejs.org/).

Installation
------------

- Clone this repository from github.
- Install the node dependencies with `npm install`

Usage
-----

You need a directory into which clone-all will clone all your repositories.
From the clone-all directory, run:

```
node clone-all.js --username=ngeor --output=../target/
```

This will clone all the repositories of the `ngeor` user into the `target` sibling folder.

Additional configuration options:

- -v: increases verbosity
- --protocol: specify the cloning protocol (https or ssh)
- --dry-run: don't clone anything, just show what would happen
- --ssh-username: specify a different username for cloning over ssh
- --no-pagination: don't fetch all repositories but only the first ones GitHub returns
