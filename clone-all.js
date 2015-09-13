#!/usr/bin/node

var https = require('https');

function dohttps(requestOptions, fn) {
	var req = https.request(requestOptions, function(res) {
		var message = '';
		if (res.statusCode === 200) {
			res.on('data', function(chunk) {
				message += chunk;
			});

			res.on('end', function() {
				fn(message);
			});
		} else {
			console.error(res.statusCode);
			res.on('data', function(d) {
				process.stdout.write(d);
			});
		}
	});

	req.end();

	req.on('error', function(e) {
		console.error(e);
	});
}

function getSourceForgeProject(projectUrl) {
	var request = {
		hostname: 'sourceforge.net',
		port: 443,
		path: '/rest' + projectUrl,
		method: 'GET',
		headers: {
			'User-Agent': 'clone-all.js'
		}
	};

	dohttps(request, function(message) {
		var project = JSON.parse(message);
		var tools = project.tools;
		var shortname = project.shortname;
		var mountPoint = '';
		var url = '';
		var i;
		for (i = tools.length - 1; i >= 0; i--) {
			if (tools[i].name === 'git') {
				mountPoint = tools[i].mount_point;
				break;
			}
		}

		if (!mountPoint) {
			return;
		}

		// RO git://git.code.sf.net/p/imagehelper/code
		// RW ssh://ngeor@git.code.sf.net/p/imagehelper/code

		url = 'git://git.code.sf.net/p/' + shortname + '/' + mountPoint;
		console.log('git clone ' + url + ' ' + shortname);
	});
}

function processSourceForge(jsonRepositories) {
	var profile = JSON.parse(jsonRepositories);
	var projects = profile.projects;
	var projectUrl;
	var i;
	for (i = projects.length - 1; i >= 0; i--) {
		projectUrl = projects[i].url;
		getSourceForgeProject(projectUrl);
	}
}

function processGitHub(jsonRepositories) {
	var repositories = JSON.parse(jsonRepositories);
	var repository;
	var url;
	var i;

	for (i = repositories.length - 1; i >= 0; i--) {
		repository = repositories[i];
		url = repository.ssh_url;

		// var url = repository.clone_url;
		console.log('git clone ' + url);
	}
}

/**
 * Fetches repository information from GitHub.
 */
function getRepositoryInfo(requestOptions) {
	dohttps(requestOptions, function(jsonRepositories) {
		if (requestOptions.hostname === 'sourceforge.net') {
			processSourceForge(jsonRepositories);
		} else {
			processGitHub(jsonRepositories);
		}
	});
}

(function() {
	'use strict';

	var fs = require('fs');
	fs.readFile('clone-all-config.json', 'utf8', function(err, data) {
		var servers;
		var i;

		if (err) {
			throw err;
		}

		servers = JSON.parse(data);

		// process every server in configuration
		for (i = servers.length - 1; i >= 0; i--) {
			getRepositoryInfo(servers[i]);
		}
	});

}());
