#!/usr/bin/node

var https = require('https'),
    cfg = require('./clone-all-config');

function dohttps(requestOptions, fn) {
	var req = https.request(requestOptions, function(res) {
		if (res.statusCode === 200) {
			var message = '';
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
	var request = 	{
		hostname : 'sourceforge.net',
		port : 443,
		path : '/rest' + projectUrl,
		method : 'GET',
		headers : {
			'User-Agent' : 'clone-all.js'
		}
	};

	dohttps(request, function(message) {
		var project = JSON.parse(message);
		var tools = project.tools;
		var shortname = project.shortname;
		var mount_point = '';
		for (var i = tools.length - 1; i >= 0; i--) {
			if (tools[i].name === "git") {
				mount_point = tools[i].mount_point;
				break;
			}
		};

		if (!mount_point) {
			return;
		}

		// RO git://git.code.sf.net/p/imagehelper/code
		// RW ssh://ngeor@git.code.sf.net/p/imagehelper/code

		var url = "git://git.code.sf.net/p/" + shortname + "/" + mount_point;

		console.log("git clone " + url + " " + shortname);
	});
}

function processSourceForge(jsonRepositories) {
	var profile = JSON.parse(jsonRepositories);
	var projects = profile.projects;
	for (var i = projects.length - 1; i >= 0; i--) {
		var projectUrl = projects[i].url;
		getSourceForgeProject(projectUrl);
	};
}

function processGitHub(jsonRepositories) {
	var repositories = JSON.parse(jsonRepositories);
	for (var i = repositories.length - 1; i >= 0; i--) {
		var repository = repositories[i];
		var url = repository.ssh_url;
		// var url = repository.clone_url;
		console.log('git clone ' + url);
	}
}

/**
 * Consumes the JSON response containing GitHub repositories
 * and prints the corresponding git clone commands.
 */
function processRepositories(requestOptions, jsonRepositories) {
	if (requestOptions.hostname === "sourceforge.net") {
		processSourceForge(jsonRepositories);
	} else {
		processGitHub(jsonRepositories);
	}
}

/**
 * Fetches repository information from GitHub.
 */
function getRepositoryInfo(requestOptions) {
	dohttps(requestOptions, function(message) {
		processRepositories(requestOptions, message);
	});
}

// process every server in configuration
for (var i = cfg.servers.length - 1; i >= 0; i--) {
	getRepositoryInfo(cfg.servers[i]);
};
