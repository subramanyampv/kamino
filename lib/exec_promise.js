var exec = require('child_process').exec;

/**
 * Creates a promise that will resolve when the given command executes.
 * The promise is never rejected.
 * Any error during running the child process is passed as the resolved value.
 */
function execPromise(cmd, execOptions) {
    var _execOptions = execOptions || {};
    var promise = new Promise(function(resolve) {
        exec(cmd, _execOptions, function(error) {
            if (error) {
                resolve(error);
            } else {
                resolve(null);
            }
        });
    });

    return promise;
}

module.exports = execPromise;
