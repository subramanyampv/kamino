import fs = require('fs');
import path = require('path');

import { CLIArguments, parse } from './args';
import { requireMasterBranch, requireNoVersionsAtHead } from './validations';

import { Git } from './git/git';
import { NextSemVer } from './next-semver';
import { SemVer } from './semver';
import { getPomVersion } from './pom/get-pom-version';
import { handleDefaultProject } from './default-project';
import { initFs } from './fs-factory';
import { initGit } from './git/git-factory';
import { updateProjectFiles } from './update';

function basicGitSanityChecks(git: Git): SemVer {
  if (!git.isGitRepository()) {
    throw new Error('Not a git repository');
  }

  if (git.hasChanges()) {
    throw new Error('There are pending changes. Please commit or stash them first.');
  }

  // Validate semver
  const currentGitVersion = git.latestVersion();
  try {
    return new SemVer(currentGitVersion);
  } catch (err) {
    throw new Error(`Current git version ${currentGitVersion} is not SemVer`);
  }
}

interface PomTagArgs {
  git: Git;
  currentGitVersion: SemVer;
  pomVersion: SemVer;
}

function handlePomTag(args: PomTagArgs): void {
  // This means the user is trying to tag the version specified in pom.xml
  const { git, currentGitVersion, pomVersion } = args;
  const tag = currentGitVersion.validateTransition(pomVersion).value;
  requireMasterBranch(git);
  requireNoVersionsAtHead(git);
  git.tag(tag);
}

interface PomBumpArgs extends PomTagArgs {
  fs: typeof fs;
  cliArgs: CLIArguments;
  nextSemVer: NextSemVer;
}

async function handlePomBump(args: PomBumpArgs): Promise<void> {
  const { git, currentGitVersion, pomVersion, nextSemVer, cliArgs, fs } = args;

  if (!pomVersion.equals(currentGitVersion)) {
    const msg = currentGitVersion.isDefined
      ? `Version cannot be specified when git tag (${currentGitVersion.value}) does not match pom.xml version (${pomVersion.value})`
      : 'No existing git tags found. Please skip the -v argument to tag the version defined in pom.xml.';
    throw new Error(msg);
  }

  // This means the user is trying to update pom.xml with a new version
  const newVersion = nextSemVer.bump(currentGitVersion);

  // Process files
  await updateProjectFiles({
    git,
    dir: cliArgs.dir,
    currentVersion: currentGitVersion.value,
    newVersion: newVersion.value,
    fs
  });

  git.commit(cliArgs.message || `Bumping version ${newVersion.value}`);
  const currentBranch = git.currentBranch();
  if (currentBranch === 'master') {
    git.tag(newVersion.value);
  }
}

interface PomArgs {
  cliArgs: CLIArguments;
  currentGitVersion: SemVer;
  git: Git;
  nextSemVer: NextSemVer;
  fs: typeof fs;
}

async function handlePomProject(args: PomArgs): Promise<void> {
  const { cliArgs, nextSemVer } = args;
  const pomVersionText = await getPomVersion(cliArgs.dir);
  let pomVersion;
  try {
    pomVersion = new SemVer(pomVersionText);
  } catch (err) {
    throw new Error(`Version ${pomVersionText} defined in pom.xml is not SemVer`);
  }

  if (!pomVersion.isDefined) {
    throw new Error('Could not determine version of pom.xml');
  }

  if (nextSemVer.isDefined) {
    await handlePomBump({
      ...args,
      pomVersion
    });
  } else {
    handlePomTag({
      ...args,
      pomVersion
    });
  }
}

export async function main(): Promise<void> {
  // Parse arguments
  const cliArgs = parse();

  /*
   * We allow one possibility for an empty `V` in case we're
   * Tagging a manually bumped pom.xml
   */
  const nextSemVer = new NextSemVer(cliArgs.V);

  // Create objects for dryRun
  const fs = initFs(cliArgs.dryRun);
  const git = initGit(cliArgs.dryRun, cliArgs.dir);
  const currentGitVersion = basicGitSanityChecks(git);
  const pomExists = fs.existsSync(path.join(cliArgs.dir, 'pom.xml'));
  if (pomExists) {
    await handlePomProject({
      cliArgs,
      currentGitVersion,
      git,
      nextSemVer,
      fs
    });
  } else {
    handleDefaultProject(currentGitVersion, git, nextSemVer);
  }

  // Push?
  if (cliArgs.push) {
    git.push();
  }
}
