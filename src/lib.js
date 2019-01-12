const fs = require('fs');
const logger = require('@ngeor/js-cli-logger');
const { isMatchingDir } = require('./filter');
const { parseArguments } = require('./args');
const { runCommand } = require('./run');

function main() {
  const cliArgs = parseArguments();
  logger.setVerboseEnabled(!!cliArgs.verbose);
  fs.readdirSync(cliArgs.dir, { withFileTypes: true })
    .filter(f => isMatchingDir(f, cliArgs))
    .forEach(f => runCommand(f.name, cliArgs));
}

module.exports = {
  main,
};
