const https = require('https');

/**
 * Performs an HTTPS request and returns a promise that resolves to the
 * body of the response.
 * @param {object} requestOptions - The request options for the HTTP request.
 * @returns {Promise<{headers: any, message: string}} A promise that represents the request.
 */
function request(url, requestOptions) {
  return new Promise(((resolve, reject) => {
    const req = https.request(url, requestOptions, (res) => {
      const minSuccess = 200;
      const maxSuccess = 300;
      let message = '';
      if (res.statusCode >= minSuccess && res.statusCode < maxSuccess) {
        res.on('data', (chunk) => {
          message += chunk;
        });

        res.on('end', () => {
          resolve({
            headers: res.headers,
            message,
          });
        });
      } else {
        res.on('data', (d) => {
          process.stdout.write(d);
        });
        reject(new Error(`Error: ${res.statusCode}`));
      }
    });

    req.end();

    req.on('error', (e) => {
      reject(e);
    });
  }));
}

module.exports = {
  request,
};
