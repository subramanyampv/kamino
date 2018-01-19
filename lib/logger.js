const chalk = require('chalk');
const options = require('./options_parser');

module.exports = {
    /**
     * Prints a detailed message.
     * The message will only be printed when verbose mode is on.
     * @param {string} msg - The message to print.
     */
    verbose(msg) {
        if (options.get().verbose) {
            console.log(msg);
        }
    },

    /**
     * Prints a message.
     * @param {string} msg - The message to print.
     */
    log(msg) {
        console.log(chalk.greenBright(msg));
    },

    /**
     * Prints an error message.
     * @param {string} msg - The message to print.
     */
    error(msg) {
        console.error(chalk.redBright(msg));
    }
};
