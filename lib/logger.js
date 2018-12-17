/** @module lib/logger */
const chalk = require('chalk');

let isVerboseEnabled = false;

module.exports = {
  isVerboseEnabled() {
    return isVerboseEnabled;
  },

  setVerboseEnabled(verboseEnabled) {
    isVerboseEnabled = verboseEnabled;
  },

  /**
     * Prints a detailed message.
     * The message will only be printed when verbose mode is on.
     * @param {string} msg - The message to print.
     */
  verbose(msg) {
    if (isVerboseEnabled) {
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
  },
};
