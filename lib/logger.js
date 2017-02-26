var options = require('./options');
module.exports = {
    verbose: function(msg) {
        if (options.isVerbose()) {
            console.log(msg);
        }
    },

    log: function(msg) {
        console.log(msg);
    },

    error: function(msg) {
        console.error(msg);
    }
};
