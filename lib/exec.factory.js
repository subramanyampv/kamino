const execAsync = require('./exec');
const execDryRunAsync = require('./exec-dry-run');

function execFactory(options) {
  return options.dryRun ? execDryRunAsync : execAsync;
}

module.exports = execFactory;
