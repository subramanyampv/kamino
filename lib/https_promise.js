var https = require('https');

/**
 * Performs an HTTPS request and returns a promise that resolves to the
 * body of the response.
 * @param {object} requestOptions - The request options for the HTTP request.
 * @returns {Promise} A promise that represents the request.
 */
module.exports = function dohttps(requestOptions) {
    return new Promise(function(resolve, reject) {
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
                reject(new Error('Error: ' + res.statusCode));
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
