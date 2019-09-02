import { bumpCodes, isSemVerFormat } from './validate-transition';
import { SemVer } from './semver';

export class NextSemVer {
  private version: string;

  constructor(version: string) {
    if (!version || bumpCodes.includes(version) || isSemVerFormat(version)) {
      this.version = version;
    } else {
      throw new Error(`Unsupported next version: ${version}`);
    }
  }

  get isDefined(): boolean {
    return !!this.version;
  }

  /**
   * Bumps a semantic version.
   * @param {SemVer} semVer The semantic version to bump.
   */
  bump(semVer: SemVer): SemVer {
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
