const fs = require('fs');
const logger = require('@ngeor/js-cli-logger');
const { isMatchingDir } = require('./filter');
const { parseArguments } = require('./args');
const { runCommand } = require('./run');

function main() {
  const args = parseArguments();
  logger.setVerboseEnabled(args.verbose);
  fs.readdirSync(args.dir, { withFileTypes: true })
    .filter(f => isMatchingDir(f, args))
    .forEach(f => runCommand(f, args));
}

module.exports = {
  main,
};
