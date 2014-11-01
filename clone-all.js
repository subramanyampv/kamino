#!/usr/bin/node

var https = require('https'),
    cfg = require('./clone-all-config');

/**
 * Consumes the JSON response containing GitHub repositories
 * and prints the corresponding git clone commands.
 */
function processRepositories(jsonRepositories) {
	var repositories = JSON.parse(jsonRepositories);
	for (var i = repositories.length - 1; i >= 0; i--) {
		var repository = repositories[i];
		console.log('git clone ' + repository.clone_url);
	}
}

/**
 * Fetches repository information from GitHub.
 */
function getRepositoryInfo(requestOptions) {
	var req = https.request(requestOptions, function(res) {
		if (res.statusCode === 200) {
			var message = '';
			res.on('data', function(chunk) {
				message += chunk;
			});
			res.on('end', function() {
				processRepositories(message);
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

// process every server in configuration
for (var i = cfg.servers.length - 1; i >= 0; i--) {
	getRepositoryInfo(cfg.servers[i]);
};
