
function isSemVerFormat(version) {
  return /^[0-9]+\.[0-9]+\.[0-9]+$/.test(version);
}

function splitSemVer(version) {
  return version.split('.').map(x => parseInt(x, 10));
}

const bumpers = {
  major: parts => `${parts[0] + 1}.0.0`,
  minor: parts => `${parts[0]}.${parts[1] + 1}.0`,
  patch: parts => `${parts[0]}.${parts[1]}.${parts[2] + 1}`,
};

/**
 * Gets the next allowed semver versions.
 * @param {string} version The version
 * @returns {string[]} A collection of versions.
 */
function allowedNextSemVer(version) {
  const parts = splitSemVer(version);
  return ['patch', 'minor', 'major'].map(b => bumpers[b](parts));
}

function validateTransition(oldVersion, newVersion) {
  if (!newVersion) {
    throw new Error('Please provide version');
  }

  if (!isSemVerFormat(oldVersion)) {
    throw new Error(`Existing version ${oldVersion} is not semver`);
  }

  const bumper = bumpers[newVersion];
  if (bumper) {
    return bumper(splitSemVer(oldVersion));
  }

  if (!isSemVerFormat(newVersion)) {
    throw new Error(`Version ${newVersion} is not semver`);
  }

  const allowedNext = allowedNextSemVer(oldVersion);
  if (allowedNext.indexOf(newVersion) < 0) {
    throw new Error(`Version ${newVersion} is not allowed. Use one of ${allowedNext.join(', ')}`);
  }

  return newVersion;
}

module.exports = {
  validateTransition,
};
