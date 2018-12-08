/** @module lib/exec_promise */
const { exec } = require('child_process');

/**
 * Creates a promise that will resolve when the given command executes.
 * @param {string} cmd - The command to run.
 * @param {object} execOptions - Options to pass to the exec function.
 * @returns {Promise} A promise that is resolved when the command finishes.
 */
function execPromise(cmd, execOptions) {
  const actualExecOptions = execOptions || {};
  const promise = new Promise(((resolve, reject) => {
    exec(cmd, actualExecOptions, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(null);
      }
    });
  }));

  return promise;
}

module.exports = execPromise;
