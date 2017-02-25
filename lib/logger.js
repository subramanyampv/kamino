var options = require('./options');
module.exports = {
    log: function(msg) {
        if (options.isVerbose()) {
            console.log(msg);
        }
    },

    error: function(msg) {
        console.error(msg);
    }
};
