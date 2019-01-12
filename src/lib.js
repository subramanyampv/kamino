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
    .map(f => f.name)
    .map(subDir => ({
      subDir,
      failed: runCommand(subDir, cliArgs),
    }))
    .filter(x => x.failed)
    .forEach(x => logger.error(`Command failed in ${x.subDir}`));
}

module.exports = {
  main,
};
