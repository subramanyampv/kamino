/** @module lib/https_promise */
const https = require('https');

/**
 * Performs an HTTPS request and returns a promise that resolves to the
 * body of the response.
 * @param {object} requestOptions - The request options for the HTTP request.
 * @returns {Promise} A promise that represents the request.
 */
module.exports = function dohttps(requestOptions) {
  return new Promise(((resolve, reject) => {
    const req = https.request(requestOptions, (res) => {
      const minSuccess = 200;
      const maxSuccess = 300;
      let message = '';
      if (res.statusCode >= minSuccess && res.statusCode < maxSuccess) {
        res.on('data', (chunk) => {
          message += chunk;
        });

        res.on('end', () => {
          resolve(message);
        });
      } else {
        reject(new Error(`Error: ${res.statusCode}`));
        res.on('data', (d) => {
          process.stdout.write(d);
        });
      }
    });

    req.end();

    req.on('error', (e) => {
      reject(e);
    });
  }));
};
