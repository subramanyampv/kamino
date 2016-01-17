clone-all
=========

Automatically clone all your github repositories.

Requirements
------------

This is a simple script that requires [Node.js](http://nodejs.org/).

Configuration
-------------

First you have to rename the file `clone-all-config.json.example` to
`clone-all-config.json` (so just remove the .example extension).

The file defines an array of "servers", containing [https requests](http://nodejs.org/api/https.html#https_https_request_options_callback).

Configuration Example
---------------------

With this configuration:

    [
        {
            "hostname": "api.github.com",
            "port": 443,
            "path": "/users/ngeor/repos",
            "method": "GET",
            "headers": {
                "User-Agent": "clone-all.js"
            }
        }
    ]

the script will clone all the GitHub repositories of the user ngeor.

You can bypass self-signed certificates by adding:

    "rejectUnauthorized": false

and you can use basic authentication with:

    "auth": "username:password"

### Extra Options

Extra options go into the key 'clone-all'.

    [
        {
            "hostname", "somehost",
            "clone-all": {
                "forceUsername": "otheruser", // force a username in the clone URL
                "localFolder": "../projects/" // folder to checkout into
            }
        }
    ]

`forceUsername` will override the username provided in the clone URL.

Installation
------------

Place clone-all.js and clone-all-config.json in a directory that is in your
PATH. Make sure that clone-all.js is marked as executable.

Usage
-----

If you run clone-all.js, it will **only output** the clone commands:

    $ clone-all.js
    git clone https://github.com/ngeor/clone-all.git
    git clone https://github.com/ngeor/IglooCastle.git

If you pipe that through shell, it will clone the repositories too:

    $ clone-all.js | sh
    Cloning into 'clone-all'...
    remote: Counting objects: 22, done.
    remote: Compressing objects: 100% (20/20), done.
    Receiving objects: 100% (22/22), 13.65 KiB | 0 bytes/s, done.
    remote: Total 22 (delta 2), reused 0 (delta 0)
    Resolving deltas: 100% (2/2), done.
    Checking connectivity... done.
    Cloning into 'IglooCastle'...
