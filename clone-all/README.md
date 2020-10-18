# clone-all

Automatically clone all your GitHub and Bitbucket Cloud repositories.

[![Build Status](https://travis-ci.org/ngeor/clone-all.svg?branch=master)](https://travis-ci.org/ngeor/clone-all)
[![npm (scoped)](https://img.shields.io/npm/v/@ngeor/clone-all.svg)](https://www.npmjs.com/package/@ngeor/clone-all)
[![Coverage Status](https://coveralls.io/repos/github/ngeor/clone-all/badge.svg)](https://coveralls.io/github/ngeor/clone-all)
[![Dependencies](https://david-dm.org/ngeor/clone-all.svg)](https://david-dm.org/ngeor/clone-all)
[![devDependencies Status](https://david-dm.org/ngeor/clone-all/dev-status.svg)](https://david-dm.org/ngeor/clone-all?type=dev)
[![PayPal donate](https://img.shields.io/badge/paypal-donate-blue.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3DDPDSSHEUGBN)

## Requirements

clone-all requires [Node.js](http://nodejs.org/) version 10 or higher.

## Usage

### Cloning

You need a directory into which clone-all will clone all your repositories.

```
npx @ngeor/clone-all --provider github --username ngeor --output ./repositories/
```

This will clone all the repositories of the `ngeor` user into the `repositories`
folder.

### Listing repository information

This command prints information about repositories without cloning them.

```
npx @ngeor/clone-all -p github --username ngeor --list
```

Example output (fields are tab separated):

```
Name    Language        Size    Pushed At
android-tictactoe       Java    386     2017-08-31T08:45:56Z
archetype-quickstart-jdk8       Shell   63      2017-04-02T07:12:55Z
clone-all       JavaScript      229     2018-01-23T15:13:59Z
```

## Command Line Options

### Specifying with repositories to fetch

- -p, --provider: github or bitbucket_cloud
- --username: the user owning the repositories
- --protocol: specify the cloning protocol (https or ssh)
- --ssh-username: specify a different username for cloning over ssh (instead of
  `git@`)
- --no-forks: Do not clone forked repositories
- --no-archived: Do not clone archived repositories

Bitbucket Cloud options:

- --owner: the user owning the repositories
- --username: the username to use against Bitbucket REST API
- --password: the password to use against Bitbucket REST API. It is possible to
  specify this parameter via the `BITBUCKET_PASSWORD` environment variable. CLI
  option has precedence.

### Cloning options

- --output: the folder in which to clone the repositories

### List options

- --list: Prints information about the repositories without cloning them.

### Additional configuration options

- -v: increases verbosity
- --dry-run: don't clone anything, just show what would happen
