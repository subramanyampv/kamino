const childProcess = require('child_process');
const path = require('path');

module.exports = function evalJsFilter(file, cliArgs) {
  if (!cliArgs.evalJs) {
    return true;
  }

  const absDir = path.resolve(cliArgs.dir, file.name);

  const { error, status } = childProcess.spawnSync(
    'node',
    ['-e', cliArgs.evalJs],
    {
      cwd: absDir,
      stdio: 'ignore',
    },
  );

  return !status && !error;
};
