const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const { updatePomFiles } = require('../pom');

describe('pom', () => {
  describe('simple', () => {
    /**
     * The directory containing the test data.
     */
    const testDir = path.join(__dirname, 'simple');

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
      // store contents of pom
      originalPomContents = fs.readFileSync(pomFilePath, 'utf8');
    });

    afterEach(() => {
      // restore pom.xml to its original contents
      fs.writeFileSync(pomFilePath, originalPomContents, 'utf8');
    });

    describe('when the version in the pom matches the current version', () => {
      let result;

      beforeEach(async () => {
        // act
        result = await updatePomFiles({
          fs,
          dir: testDir,
          currentVersion: '0.9.2',
          newVersion: '1.0.0',
        });
      });

      it('should return the pom.xml in the list of modified files', () => {
        expect(result).to.eql(['pom.xml']);
      });

      it('should modify the pom.xml', () => {
        expect(
          fs.readFileSync(pomFilePath, 'utf8'),
        ).to.eql(fs.readFileSync(path.join(testDir, 'pom-expected.xml'), 'utf8'));
      });
    });

    describe('when the version in the pom does not match the current version', () => {
      let result;

      beforeEach(async () => {
        // act
        result = await updatePomFiles({
          fs,
          dir: testDir,
          currentVersion: '0.9.3',
          newVersion: '1.0.0',
        });
      });

      it('should return an empty list of modified files', () => {
        expect(result).to.be.empty;
      });

      it('should not modify the pom.xml', () => {
        expect(
          fs.readFileSync(pomFilePath, 'utf8'),
        ).to.eql(originalPomContents);
      });
    });
  });

  describe('multi-module', () => {
    /**
     * The directory containing the test data.
     */
    const testDir = path.join(__dirname, 'multi-module');

    /**
     * Directories containing pom files.
     */
    const pomDirs = [
      testDir,
      path.join(testDir, 'bar-child-module'),
      path.join(testDir, 'foo-child-module'),
    ];

    const pomInputFiles = pomDirs.map(d => path.join(d, 'pom.xml'));

    /**
     * The original contents of the pom.xml under test.
     * It is stored because the function will (potentially) modify it.
     */
    let originalPomContents;

    beforeEach(() => {
      // store contents of pom
      originalPomContents = pomInputFiles.map(p => ({
        file: p,
        contents: fs.readFileSync(p, 'utf8'),
      }));
    });

    afterEach(() => {
      // restore pom.xml to its original contents
      originalPomContents.forEach(x => fs.writeFileSync(x.file, x.contents, 'utf8'));
    });

    describe('when the version in the pom matches the current version', () => {
      let result;

      beforeEach(async () => {
        // act
        result = await updatePomFiles({
          fs,
          dir: testDir,
          currentVersion: '3.12.0',
          newVersion: '3.13.0',
        });
      });

      it('should return the pom.xml files in the list of modified files', () => {
        expect(result).to.eql([
          'pom.xml',
          path.join('foo-child-module', 'pom.xml'),
          path.join('bar-child-module', 'pom.xml'),
        ]);
      });

      pomDirs.forEach((d) => {
        it(`should modify the pom.xml in ${d}`, () => {
          const inputPom = path.join(d, 'pom.xml');
          const expectedPom = path.join(d, 'pom-expected.xml');
          expect(
            fs.readFileSync(inputPom, 'utf8'),
          ).to.eql(fs.readFileSync(expectedPom, 'utf8'));
        });
      });
    });
  });
});
