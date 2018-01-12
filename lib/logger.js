const chalk = require('chalk');
var options = require('./options');

module.exports = {
    verbose: function(msg) {
        if (options.isVerbose()) {
            console.log(msg);
        }
    },

    log: function(msg) {
        console.log(chalk.greenBright(msg));
    },

    error: function(msg) {
        console.error(chalk.redBright(msg));
    }
};
