const fs = require('fs');
const path = require('path');
const { parse } = require('./args');
const { updateProjectFiles } = require('./update');
const { initFs } = require('./fs-factory');
const { createGit, initGit } = require('./git');
const {
  SemVer,
  NextSemVer
} = require('./validate-transition');
const { getPomVersion } = require('./pom');

function requireNoVersionsAtHead(git) {
  const versionsAtHead = git.versionsAtHead();
  if (versionsAtHead && versionsAtHead.length) {
    throw new Error(`The current commit is already tagged with versions ${versionsAtHead}.`);
  }
}

function requireNextVersion(nextSemVer) {
  if (!nextSemVer.isDefined) {
    throw new Error('Please specify the version with -v.');
  }
}

function requireMasterBranch(git) {
  const branch = git.currentBranch();
  if (branch !== 'master') {
    throw new Error('Only the master branch can be tagged.');
  }
}

async function basicGitSanityChecks(git) {
  if (!git.isGitRepository()) {
    throw new Error('Not a git repository.');
  }

  if (await git.hasChanges()) {
    throw new Error('There are pending changes. Please commit or stash them first.');
  }

  // validate semver
  const currentGitVersion = git.latestVersion();
  try {
    return new SemVer(currentGitVersion);
  } catch (e) {
    throw new Error(`Current git version ${currentGitVersion} is not SemVer.`);
  }
}

async function handlePomTag(currentGitVersion, git, pomVersion) {
  // this means the user is trying to tag the version specified in pom.xml
  const tag = currentGitVersion.validateTransition(pomVersion).value;
  requireMasterBranch(git);
  requireNoVersionsAtHead(git);
  git.tag(tag);
}

async function handlePomBump(cliArgs, currentGitVersion, git, nextSemVer, pomVersion) {
  if (!pomVersion.equals(currentGitVersion)) {
    const msg = currentGitVersion.isDefined
      ? `Version cannot be specified when git tag (${currentGitVersion.value}) does not match pom.xml version (${pomVersion.value}).`
      : 'No existing git tags found. Please skip the -v argument to tag the version defined in pom.xml.';
    throw new Error(msg);
  }

  // this means the user is trying to update pom.xml with a new version
  const newVersion = nextSemVer.bump(currentGitVersion);

  // process files
  await updateProjectFiles(git, {
    dir: cliArgs.dir,
    currentVersion: currentGitVersion.value,
    newVersion: newVersion.value
  });

  git.commit(cliArgs.message || `Bumping version ${newVersion.value}.`);
  const currentBranch = git.currentBranch();
  if (currentBranch === 'master') {
    git.tag(newVersion.value);
  }
}

async function handlePomProject(cliArgs, currentGitVersion, git, nextSemVer) {
  const pomVersionText = await getPomVersion(cliArgs.dir);
  let pomVersion;
  try {
    pomVersion = new SemVer(pomVersionText);
  } catch (e) {
    throw new Error(`Version ${pomVersionText} defined in pom.xml is not SemVer.`);
  }

  if (!pomVersion.isDefined) {
    throw new Error('Could not determine version of pom.xml.');
  }

  if (nextSemVer.isDefined) {
    await handlePomBump(cliArgs, currentGitVersion, git, nextSemVer, pomVersion);
  } else {
    await handlePomTag(currentGitVersion, git, pomVersion);
  }
}

async function handleDefaultProject(currentGitVersion, git, nextSemVer) {
  requireNextVersion(nextSemVer);
  const newVersion = nextSemVer.bump(currentGitVersion);
  requireMasterBranch(git);
  requireNoVersionsAtHead(git);
  git.tag(newVersion.value);
}

async function main() {
  // parse arguments
  const cliArgs = parse();

  // we allow one possibility for an empty `V` in case we're
  // tagging a manually bumped pom.xml
  const nextSemVer = new NextSemVer(cliArgs.V);

  // create objects for dryRun
  // TODO don't patch standard fs method for dry run
  initFs(cliArgs.dryRun);
  initGit(cliArgs.dryRun);

  const git = createGit(cliArgs.dir);
  const currentGitVersion = await basicGitSanityChecks(git);
  const pomExists = fs.existsSync(path.join(cliArgs.dir, 'pom.xml'));
  if (pomExists) {
    await handlePomProject(cliArgs, currentGitVersion, git, nextSemVer);
  } else {
    await handleDefaultProject(currentGitVersion, git, nextSemVer);
  }

  // push?
  if (cliArgs.push) {
    git.push();
  }
}

module.exports = {
  main
};
