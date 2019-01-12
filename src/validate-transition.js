
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
  return [patch, minor, major];
}

function validateTransition(oldVersion, newVersion) {
  if (!newVersion) {
    throw new Error('Please provide version');
  }

  if (!isSemVerFormat(oldVersion)) {
    throw new Error(`Existing version ${oldVersion} is not semver`);
  }

  if (!isSemVerFormat(newVersion)) {
    throw new Error(`Version ${newVersion} is not semver`);
  }

  const allowedNext = allowedNextSemVer(oldVersion);
  if (allowedNext.indexOf(newVersion) < 0) {
    throw new Error(`Version ${newVersion} is not allowed. Use one of ${allowedNext.join(', ')}`);
  }

  return true;
}

module.exports = {
  validateTransition,
};
