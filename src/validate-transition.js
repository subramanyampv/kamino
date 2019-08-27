/* eslint-disable max-classes-per-file */
const bumpCodes = ['patch', 'minor', 'major'];

function isSemVerFormat(version) {
  return /^[0-9]+\.[0-9]+\.[0-9]+$/.test(version);
}

function splitSemVer(version) {
  if (!version) {
    throw new Error('version');
  }

  if (!isSemVerFormat(version)) {
    throw new Error(`Version ${version} is not SemVer.`);
  }

  return version.split('.').map((x) => parseInt(x, 10));
}

class SemVer {
  constructor(version) {
    if (!version) {
      this.parts = [];
    } else if (typeof version === 'string') {
      this.parts = splitSemVer(version);
    } else if (typeof version === 'object' && version.length === 3) {
      this.parts = version;
    } else {
      throw new Error('unsupported version');
    }
  }

  get isDefined() {
    return this.parts.length === 3;
  }

  /**
   * Gets the formatted value of this SemVer.
   * @returns {string}
   */
  get value() {
    return this.isDefined ? this.parts.join('.') : '0.0.0';
  }

  equals(other) {
    if (!other || !other.parts || other.parts.length !== this.parts.length) {
      return false;
    }

    for (let i = 0; i < this.parts.length; i += 1) {
      if (this.parts[i] !== other.parts[i]) {
        return false;
      }
    }

    return true;
  }

  bumpByCode(code) {
    switch (code) {
      case 'major':
        return this.isDefined
          ? new SemVer([this.parts[0] + 1, 0, 0]) : new SemVer([1, 0, 0]);
      case 'minor':
        return this.isDefined
          ? new SemVer([this.parts[0], this.parts[1] + 1, 0]) : new SemVer([0, 1, 0]);
      case 'patch':
        return this.isDefined
          ? new SemVer([this.parts[0], this.parts[1], this.parts[2] + 1]) : new SemVer([0, 0, 1]);
      default:
        throw new Error('Unsupported code');
    }
  }

  get validNextVersions() {
    if (this.isDefined) {
      return bumpCodes.map((c) => this.bumpByCode(c));
    }

    const allZeroes = new SemVer([0, 0, 0]);
    return [allZeroes].concat(allZeroes.validNextVersions);
  }

  /**
   * Checks if this SemVer can be transitioned into the given version.
   * @param {SemVer} potentialNextVersion The potential next version.
   */
  canTransitionTo(potentialNextVersion) {
    const validTransitions = this.validNextVersions;
    return validTransitions.some((x) => x.equals(potentialNextVersion));
  }

  /**
   * Validates the transition from this instance to a next one.
   * @param {SemVer} potentialNextVersion The potential next version.
   */
  validateTransition(potentialNextVersion) {
    if (this.canTransitionTo(potentialNextVersion)) {
      return potentialNextVersion;
    }

    const validTransitions = this.validNextVersions;
    throw new Error(`Version ${potentialNextVersion.value} is not allowed. Use one of ${validTransitions.map((x) => x.value).join(', ')}.`);
  }
}

class NextSemVer {
  constructor(version) {
    if (!version
      || (
        typeof version === 'string'
        && (
          bumpCodes.includes(version)
          || isSemVerFormat(version)
        )
      )) {
      this.version = version;
    } else {
      throw new Error(`Unsupported next version: ${version}`);
    }
  }

  get isDefined() {
    return !!this.version;
  }

  /**
   * Bumps a semantic version.
   * @param {SemVer} semVer The semantic version to bump.
   */
  bump(semVer) {
    if (!this.isDefined) {
      throw new Error('version is not defined');
    }

    if (bumpCodes.includes(this.version)) {
      return semVer.bumpByCode(this.version);
    }

    const potentialNextVersion = new SemVer(this.version);
    return semVer.validateTransition(potentialNextVersion);
  }
}

module.exports = {
  SemVer,
  NextSemVer
};
