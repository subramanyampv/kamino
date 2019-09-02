import { NextSemVer } from './next-semver';
import { SemVer } from './semver';
import { expect } from 'chai';

describe('validate-transition', () => {
  function validateTransition(from: string, to: string): string {
    const semVer = new SemVer(from);
    const nextSemVer = new NextSemVer(to);
    return nextSemVer.bump(semVer).value;
  }

  it('should throw if new version is empty', () => {
    expect(() => validateTransition('1.0.0', ''))
      .to.throw('version is not defined');
  });

  it('should throw if old version is not semver', () => {
    expect(() => validateTransition('1.0.c', '1.0.1'))
      .to.throw('Version 1.0.c is not SemVer.');
  });

  it('should throw if new version is not semver', () => {
    expect(() => validateTransition('1.0.0', '1.0.x'))
      .to.throw('Unsupported next version: 1.0.x');
  });

  it('should throw if new version leaves a semver gap', () => {
    expect(() => validateTransition('1.0.0', '1.0.2'))
      .to.throw('Version 1.0.2 is not allowed. Use one of 1.0.1, 1.1.0, 2.0.0');
  });

  it('should allow patch explicitly', () => {
    expect(validateTransition('1.0.0', '1.0.1'))
      .to.equal('1.0.1');
  });

  it('should allow patch automatically', () => {
    expect(validateTransition('1.0.0', 'patch')).to.equal('1.0.1');
  });

  it('should allow minor explicitly', () => {
    expect(validateTransition('1.0.0', '1.1.0')).to.equal('1.1.0');
  });

  it('should allow minor automatically', () => {
    expect(validateTransition('1.0.0', 'minor')).to.equal('1.1.0');
  });

  it('should allow major explicitly', () => {
    expect(validateTransition('1.0.0', '2.0.0')).to.equal('2.0.0');
  });

  it('should allow major automatically', () => {
    expect(validateTransition('1.0.0', 'major')).to.equal('2.0.0');
  });
});
