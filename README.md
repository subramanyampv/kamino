generator-nodejs
=========

A Yeoman generator for nodeJS libraries

[![Build Status](https://travis-ci.org/ngeor/generator-nodejs.svg?branch=master)](https://travis-ci.org/ngeor/generator-nodejs)
[![npm (scoped)](https://img.shields.io/npm/v/@ngeor/generator-nodejs.svg)](https://www.npmjs.com/package/@ngeor/generator-nodejs)
[![Dependencies](https://david-dm.org/ngeor/generator-nodejs.svg)](https://david-dm.org/ngeor/generator-nodejs)
[![devDependencies Status](https://david-dm.org/ngeor/generator-nodejs/dev-status.svg)](https://david-dm.org/ngeor/generator-nodejs?type=dev)

## Installation

Install the generator with `npm i -g yo @ngeor/generator-nodejs`.

## Creating a new repository

- Create a new project in GitHub. Select license MIT.
- Clone repository locally.
- Run the yeoman generator with `yo @ngeor/nodejs`.
- Enable the project in Travis.
- Enable the project in Coveralls.
- Add the implementation.
- Run `travis setup npm`.

## Developing

Run tests with Docker locally with:

```
docker run --rm -v $PWD:/code -w /code node:10 npm test
```
