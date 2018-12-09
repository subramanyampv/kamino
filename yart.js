const { parse } = require('./args');
const { updateProjectFiles } = require('./update');
const fsFactory = require('./fs-factory').factory;
const gitFactory = require('./git').factory;

function isSemVerFormat(version) {
  return /^[0-9]+\.[0-9]+\.[0-9]+$/.test(version);
}

/**
 * Gets the next allowed semver versions.
 * @param {string} version The version
 * @returns {string[]} A collection of versions.
 */
function allowedNextSemVer(version) {
  const parts = version.split('.').map(x => parseInt(x, 10));
  const major = `${parts[0] + 1}.0.0`;
  const minor = `${parts[0]}.${parts[1] + 1}.0`;
  const patch = `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
  return [major, minor, patch];
}

async function main() {
  // parse arguments
  const args = parse();

  // create objects for dryRun
  const fs = fsFactory(args.dryRun);
  const git = gitFactory(args.dir, args.dryRun);

  // validate semver
  const latestVersion = git.latestVersion();
  const newVersion = args.V;
  if (!newVersion) {
    throw new Error('Please provide version');
  }

  if (!isSemVerFormat(latestVersion)) {
    throw new Error(`Existing version ${latestVersion} is not semver`);
  }

  if (!isSemVerFormat(newVersion)) {
    throw new Error(`Version ${newVersion} is not semver`);
  }

  const allowedNext = allowedNextSemVer(latestVersion);
  if (allowedNext.indexOf(newVersion) < 0) {
    throw new Error(`Version ${newVersion} is not allowed. Use one of ${allowedNext}`);
  }

  // process files
  await updateProjectFiles({
    fs,
    git,
    dir: args.dir,
    currentVersion: latestVersion,
    newVersion,
  });

  // commit?
  if (args.commit) {
    git.commit(args.message || `Bumping version ${newVersion}`);
    git.tag(newVersion);

    // push?
    if (args.push) {
      git.push();
    }
  }
}

main().catch((err) => {
  console.log(err.message);
  process.exitCode = 1;
});
