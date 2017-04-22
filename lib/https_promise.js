var https = require('https');
var logger = require('./logger');

/**
 * Performs an HTTPS request and returns a promise that resolves to the
 * body of the response.
 */
module.exports = function dohttps(requestOptions) {
    return new Promise(function(resolve, reject) {
        logger.verbose(requestOptions.path);
        var req = https.request(requestOptions, function(res) {
            var message = '';
            if (res.statusCode >= 200 && res.statusCode < 300) {
                res.on('data', function(chunk) {
                    message += chunk;
                });

                res.on('end', function() {
                    resolve(message);
                });
            } else {
                reject('Error: ' + res.statusCode);
                res.on('data', function(d) {
                    process.stdout.write(d);
                });
            }
        });

        req.end();

        req.on('error', function(e) {
            reject(e);
        });
    });
};
