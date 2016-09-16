var process = require('process');
var verbose = process.argv.indexOf('-v') >= 0;
module.exports = {
    log: function(msg) {
        if (verbose) {
            console.log(msg);
        }
    },

    error: function(msg) {
        console.error(msg);
    }
};
