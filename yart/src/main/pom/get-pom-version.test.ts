import path = require('path');
import { expect } from 'chai';
import { getPomVersion } from './get-pom-version';

describe('getPomVersion', () => {
  it('should read the simple module', async () => {
    // Arrange
    const testDir = path.join(__dirname, '../../test/fixtures', 'simple');

    // Act
    const result = await getPomVersion(testDir);

    // Assert
    expect(result).to.equal('0.9.2');
  });

  it('should read the multi module', async () => {
    // Arrange
    const testDir = path.join(__dirname, '../../test/fixtures', 'multi-module');

    // Act
    const result = await getPomVersion(testDir);

    // Assert
    expect(result).to.equal('3.12.0');
  });
});
