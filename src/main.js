const fs = require('fs');
const path = require('path');
const { parse } = require('./args');
const { updateProjectFiles } = require('./update');
const { initFs } = require('./fs-factory');
const { createGit, initGit } = require('./git');
const { isAllowedTransition, isSemVerFormat, validateTransition } = require('./validate-transition');
const { getPomVersion } = require('./pom');

function requireNoVersionsAtHead(git) {
  const versionsAtHead = git.versionsAtHead();
  if (versionsAtHead && versionsAtHead.length) {
    throw new Error(`The current commit is already tagged with versions ${versionsAtHead}.`);
  }
}

async function main() {
  // parse arguments
  const cliArgs = parse();

  // create objects for dryRun
  initFs(cliArgs.dryRun);
  initGit(cliArgs.dryRun);

  const git = createGit(cliArgs.dir);
  if (!git.isGitRepository()) {
    throw new Error('Not a git repository.');
  }

  if (git.hasChanges()) {
    throw new Error('There are pending changes. Please commit or stash them first.');
  }

  const currentBranch = git.currentBranch();
  if (currentBranch !== 'master') {
    throw new Error(`The current branch must be master, but it was ${currentBranch}.`);
  }

  // validate semver
  const currentGitVersion = git.latestVersion();
  if (currentGitVersion && !isSemVerFormat(currentGitVersion)) {
    throw new Error(`Current git version ${currentGitVersion} is not SemVer.`);
  }

  const pomExists = fs.existsSync(path.join(cliArgs.dir, 'pom.xml'));
  let pomVersion = null;
  if (pomExists) {
    pomVersion = await getPomVersion(cliArgs.dir);
    if (!pomVersion) {
      throw new Error('Could not determine version of pom.xml.');
    }

    if (!isSemVerFormat(pomVersion)) {
      throw new Error(`Version ${pomVersion} defined in pom.xml is not SemVer.`);
    }
  }

  let newVersion = null;
  if (!currentGitVersion) {
    // no tags exist
    if (pomVersion) {
      newVersion = pomVersion;
      // TODO: check cliArgs.V
    } else {
      newVersion = '0.0.1';
      // TODO: check cliArgs.V
    }
  } else if (pomVersion) {
    if (currentGitVersion === pomVersion) {
      // ok, we need to commit and bump
      newVersion = validateTransition(currentGitVersion, cliArgs.V);

      // process files
      await updateProjectFiles(git, {
        dir: cliArgs.dir,
        currentVersion: currentGitVersion,
        newVersion
      });

      git.commit(cliArgs.message || `Bumping version ${newVersion}.`);
    } else {
      // no need to commit as long as pom.xml is ahead of git tag
      if (!isAllowedTransition(currentGitVersion, pomVersion)) {
        throw new Error(`Version mismatch between git tag (${currentGitVersion}) and pom (${pomVersion}).`);
      }

      // TODO: check cliArgs.V

      // check the current commit is not tagged already
      requireNoVersionsAtHead(git);

      newVersion = pomVersion;
    }
  } else {
    // no pom.xml
    // check the current commit is not tagged already
    requireNoVersionsAtHead(git);
    newVersion = validateTransition(currentGitVersion, cliArgs.V);
  }

  // check the current commit is not tagged already
  git.tag(newVersion);

  // push?
  if (cliArgs.push) {
    git.push();
  }

  return newVersion;
}

module.exports = {
  main
};
