import { bumpCodes, splitSemVer } from './validate-transition';

export class SemVer {
  private parts: number[];

  constructor(version: string | number[]) {
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

  get isDefined(): boolean {
    return this.parts.length === 3;
  }

  /**
   * Gets the formatted value of this SemVer.
   * @returns {string}
   */
  get value(): string {
    return this.isDefined ?
      this.parts.join('.') :
      '0.0.0';
  }

  equals(other): boolean {
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

  bumpByCode(code): SemVer {
    switch (code) {
      case 'major':
        return this.isDefined ?
          new SemVer([
            this.parts[0] + 1,
            0,
            0
          ]) :
          new SemVer([
            1,
            0,
            0
          ]);
      case 'minor':
        return this.isDefined ?
          new SemVer([
            this.parts[0],
            this.parts[1] + 1,
            0
          ]) :
          new SemVer([
            0,
            1,
            0
          ]);
      case 'patch':
        return this.isDefined ?
          new SemVer([
            this.parts[0],
            this.parts[1],
            this.parts[2] + 1
          ]) :
          new SemVer([
            0,
            0,
            1
          ]);
      default:
        throw new Error('Unsupported code');
    }
  }

  get validNextVersions(): SemVer[] {
    if (this.isDefined) {
      return bumpCodes.map(code => this.bumpByCode(code));
    }

    const allZeroes = new SemVer([
      0,
      0,
      0
    ]);
    return [allZeroes].concat(allZeroes.validNextVersions);
  }

  /**
   * Checks if this SemVer can be transitioned into the given version.
   * @param {SemVer} potentialNextVersion The potential next version.
   */
  canTransitionTo(potentialNextVersion): boolean {
    const validTransitions = this.validNextVersions;
    return validTransitions
      .some(version => version.equals(potentialNextVersion));
  }

  /**
   * Validates the transition from this instance to a next one.
   * @param {SemVer} potentialNextVersion The potential next version.
   */
  validateTransition(potentialNextVersion: SemVer): SemVer {
    if (this.canTransitionTo(potentialNextVersion)) {
      return potentialNextVersion;
    }

    const validTransitions = this.validNextVersions;
    throw new Error(`Version ${potentialNextVersion.value} is not allowed. Use one of ${validTransitions.map(version => version.value).join(', ')}.`);
  }
}
