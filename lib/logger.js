const chalk = require('chalk');
var options = require('./options_parser');

module.exports = {
    verbose: function(msg) {
        if (options.get().verbose) {
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
