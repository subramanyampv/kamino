const { exec } = require('child_process');

function execAsync(cmd, options) {
  // TODO use spawn
  return new Promise(((resolve, reject) => {
    exec(cmd, options, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(null);
      }
    });
  }));
}

module.exports = execAsync;
