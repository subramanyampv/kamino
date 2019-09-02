import chai = require('chai');
import fs = require('fs');
import path = require('path');
import { testUtils } from '../../test/utils/test-utils';
import { updatePomFiles } from './update-pom-files';
const { expect } = chai;
chai.use(testUtils);

describe('updatePomFiles (single module)', () => {

  /**
   * The directory containing the test data.
   */
  const testDir = path.join(__dirname, '../../test', 'fixtures', 'simple');

  /**
   * The full file path to the pom.xml under test.
   */
  const pomFilePath = path.join(testDir, 'pom.xml');

  /**
   * The original contents of the pom.xml under test.
   * It is stored because the function will (potentially) modify it.
   */
  let originalPomContents;

  beforeEach(() => {
    // Store contents of pom
    originalPomContents = fs.readFileSync(pomFilePath, 'utf8');
  });

  afterEach(() => {
    // Restore pom.xml to its original contents
    fs.writeFileSync(pomFilePath, originalPomContents, 'utf8');
  });

  describe('when the version in the pom matches the current version', () => {
    let result;

    beforeEach(async () => {
      // Act
      result = await updatePomFiles({
        dir: testDir,
        currentVersion: '0.9.2',
        newVersion: '1.0.0',
        fs
      });
    });

    it('should return the pom.xml in the list of modified files', () => {
      expect(result).to.have.members(['pom.xml']);
    });

    it('should modify the pom.xml', () => {
      expect(pomFilePath).to.have.sameContentsWith(path.join(testDir, 'pom-expected.xml'));
    });
  });

  describe('when the version in the pom does not match the current version', () => {
    let result;

    beforeEach(async () => {
      // Act
      result = await updatePomFiles({
        dir: testDir,
        currentVersion: '0.9.3',
        newVersion: '1.0.0',
        fs
      });
    });

    it('should return an empty list of modified files', () => {
      expect(result).to.be.empty;
    });

    it('should not modify the pom.xml', () => {
      expect(fs.readFileSync(pomFilePath, 'utf8')).to.equal(originalPomContents);
    });
  });
});
