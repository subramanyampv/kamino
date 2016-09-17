clone-all
=========

Automatically clone all your github repositories.

[![Build Status](https://travis-ci.org/ngeor/clone-all.svg?branch=master)](https://travis-ci.org/ngeor/clone-all)
[![Dependencies](https://david-dm.org/ngeor/clone-all.svg)](https://david-dm.org/ngeor/clone-all)

Requirements
------------

This is a simple script that requires [Node.js](http://nodejs.org/).

Installation
------------

- Clone this repository from github.
- Install the node dependencies with `npm install`

Configuration
-------------

First you have to rename the file `clone-all-config.json.example` to
`clone-all-config.json` (so just remove the .example extension).

This JSON file defines an array of servers, so you could potentially fetch
repositories for more than one user. The basic definition of each server is just
an [https request](http://nodejs.org/api/https.html#https_https_request_options_callback) so the following
parameters can be defined:

- hostname: The host of the GIT server (e.g. `api.github.com` for GitHub)
- port: The port of the GIT server (e.g. `443` for GitHub)
- path: The API path that returns repository information. For GitHub, that is `/users/username/repos` (replace username with your own)
- method: The HTTP method to use for the request (e.g. `GET`)

Note that only the `path` parameter is mandatory. If you don't supply the rest, GitHub is assumed.

Additional HTTPS options include:

- rejectUnauthorized: Allows bypassing self-signed certificates by setting to `false`
- auth: Allows basic authentication (set it to `username:password`)

Cloning options (placed inside custom `clone-all` object in JSON as shown in the example file):

- forceUsername: Allows to force a username inside the clone URL. Use it for SSH URLs that no implicit user can be derived.
- localFolder: A folder in which the repositories will be cloned in. Relative to the current path (e.g. `../Projects/`)
- fetchAllPages: By default, this script will only fetch the first 30 GitHub repositories. Set this to `true` to fetch all.
- useHTTPS: By default, the script will use the SSH protocol for cloning. Set this to `true` if you want to use HTTPS instead.
