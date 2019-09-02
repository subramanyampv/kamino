import chai = require('chai');
import fs = require('fs');
import path = require('path');
import { testUtils } from '../../test/utils/test-utils';
import { updatePomFiles } from './update-pom-files';

const { expect } = chai;
chai.use(testUtils);

describe('updatePomFiles', () => {
  describe('multi-module', () => {

    /**
     * The directory containing the test data.
     */
    const testDir = path.join(__dirname, '../../test', 'fixtures', 'multi-module');

    /**
     * Directories containing pom files.
     */
    const pomDirs = [
      testDir,
      path.join(testDir, 'bar-child-module'),
      path.join(testDir, 'foo-child-module')
    ];

    const pomInputFiles = pomDirs.map(dir => path.join(dir, 'pom.xml'));

    /**
     * The original contents of the pom.xml under test.
     * It is stored because the function will (potentially) modify it.
     */
    let originalPomContents;

    beforeEach(() => {
      // Store contents of pom
      originalPomContents = pomInputFiles.map(path => ({
        file: path,
        contents: fs.readFileSync(path, 'utf8')
      }));
    });

    afterEach(() => {
      // Restore pom.xml to its original contents
      originalPomContents.forEach(fileWithContents => fs.writeFileSync(fileWithContents.file, fileWithContents.contents, 'utf8'));
    });

    describe('when the version in the pom matches the current version', () => {
      let result: string[];

      beforeEach(async () => {
        // Act
        result = await updatePomFiles({
          dir: testDir,
          currentVersion: '3.12.0',
          newVersion: '3.13.0',
          fs
        });
      });

      it('should return the pom.xml files in the list of modified files', () => {
        expect(result).to.have.members([
          'pom.xml',
          path.join('foo-child-module', 'pom.xml'),
          path.join('bar-child-module', 'pom.xml')
        ]);
      });

      pomDirs.forEach(dir => {
        it(`should modify the pom.xml in ${dir}`, () => {
          const inputPom = path.join(dir, 'pom.xml');
          const expectedPom = path.join(dir, 'pom-expected.xml');
          expect(inputPom).to.have.sameContentsWith(expectedPom);
        });
      });
    });
  });
});
