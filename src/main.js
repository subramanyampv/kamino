const { parse } = require('./args');
const { updateProjectFiles } = require('./update');
const { initFs } = require('./fs-factory');
const { createGit, initGit } = require('./git');
const { validateTransition } = require('./validate-transition');
const { getCurrentVersion } = require('./get-current-version');

function reTag(cliArgs, currentVersion) {
  const { source, V } = cliArgs;

  if (source === 'git') {
    throw new Error('the retag option cannot be combined with git as a version source');
  }

  if (V) {
    throw new Error('the retag option does not support the v parameter');
  }

  if (!currentVersion) {
    throw new Error('current version was not provided');
  }

  const git = createGit(cliArgs.dir);
  if (git.versionExists(currentVersion)) {
    throw new Error('the git tag already exists');
  }

  git.tag(currentVersion);

  // push?
  if (cliArgs.push) {
    git.push('push');
  }
}

async function main() {
  // parse arguments
  const cliArgs = parse();

  // create objects for dryRun
  initFs(cliArgs.dryRun);
  initGit(cliArgs.dryRun);

  // validate semver
  const currentVersion = await getCurrentVersion(cliArgs);
  if (cliArgs.reTag) {
    reTag(cliArgs, currentVersion);
    return;
  }

  const newVersion = validateTransition(currentVersion, cliArgs.V);

  // process files
  await updateProjectFiles({
    dir: cliArgs.dir,
    currentVersion,
    newVersion,
  });

  // commit?
  const git = createGit(cliArgs.dir);
  if (cliArgs.commit) {
    git.commit(cliArgs.message || `Bumping version ${newVersion}`);
    git.tag(newVersion);

    // push?
    if (cliArgs.push) {
      git.push('follow');
    }
  }
}

module.exports = {
  main,
};
