# yart
yart is yet another release tool

[![Build Status](https://travis-ci.org/ngeor/yart.svg?branch=master)](https://travis-ci.org/ngeor/yart)
[![npm (scoped)](https://img.shields.io/npm/v/@ngeor/yart.svg)](https://www.npmjs.com/package/@ngeor/yart)
[![Coverage Status](https://coveralls.io/repos/github/ngeor/yart/badge.svg)](https://coveralls.io/github/ngeor/yart)
[![Dependencies](https://david-dm.org/ngeor/yart.svg)](https://david-dm.org/ngeor/yart)
[![devDependencies Status](https://david-dm.org/ngeor/yart/dev-status.svg)](https://david-dm.org/ngeor/yart?type=dev)

## Overview

You can use yart to automatically bump up the version of a project in a
consistent way, ensuring no gaps exist in SemVer sequences.

Currently only Maven projects are supported.

## Usage

You can use yart without installing it with `npx @ngeor/yart`. If you prefer, you
can install it with `npm i -g @ngeor/yart` and then run it with `yart`.

## Tags

yart reads and sorts the git tags of the repo to determine the current version,
which is the greatest.

No gaps in SemVer are allowed, so if the current version is 1.2.3, the allowed
values for the next version are:

- 1.2.4 (patch)
- 1.3.0 (minor)
- 2.0.0 (major)

yart will tag the version and push it to git in a consistent format:

- the tag will be prefixed with v, e.g. v1.3.0
- the tag message will be "Releasing version 1.3.0"

## Files

The version might be present in language specific files and yart tries to bump
the version there too.

Currently only Maven projects are supported.

### Maven

yart bumps up the version in `pom.xml`. It takes into account multi-module
projects, ensuring that child modules point to the correct parent version.

### Readme files

yart will do a text replace in files named `README.md`, replacing the current
version with the new version.

## Options

- `-help`: shows information about the program
- `-version`: The desired version e.g. 1.3.0
- `-dir`: Optional: the directory of the project to version (defaults to current
  directory)
- `-message`: Optional: a commit message to specify when committing project
  files. Defaults to "Bumping version x.y.z"
- `-no-commit`: Does not commit or create the tag (dry run)
- `-no-push`: Does not push to remote (dry run)
