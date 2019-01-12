const path = require('path');
const { expect } = require('chai');
const { getPomVersion } = require('./get-pom-version');

describe('getPomVersion', () => {
  it('should read the simple module', async () => {
    // arrange
    const testDir = path.join(__dirname, '../../test', 'simple');

    // act
    const result = await getPomVersion(testDir);

    // assert
    expect(result).to.equal('0.9.2');
  });

  it('should read the multi module', async () => {
    // arrange
    const testDir = path.join(__dirname, '../../test', 'multi-module');

    // act
    const result = await getPomVersion(testDir);

    // assert
    expect(result).to.equal('3.12.0');
  });
});
