const { createGit } = require('./git');
const { getPomVersion } = require('./pom');

function getLatestVersionFromGit(dir) {
  const git = createGit(dir);
  return Promise.resolve(git.latestVersion());
}

function getCurrentVersion(cliArgs) {
  const {
    dir, source
  } = cliArgs;

  let result;
  switch (source) {
    case 'git':
      result = getLatestVersionFromGit(dir);
      break;
    case 'pom':
      result = getPomVersion(dir);
      break;
    default:
      throw new Error(`Unsupported version source: ${source}`);
  }

  return result;
}

module.exports = {
  getCurrentVersion
};
