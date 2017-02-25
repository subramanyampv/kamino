var exec = require('child_process').exec;

function execPromise(cmd) {
    var promise = new Promise(function(resolve, reject) {
        exec(cmd, function(error) {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });

    return promise;
}

module.exports = execPromise;
