import path = require('path');
import { Then } from 'cucumber';
import chai = require('chai');
import { fixturePath } from '../../utils/path-utils';
import { getPomVersion } from '../../../main/pom/get-pom-version';
import { testUtils } from '../../utils/test-utils';

const { expect } = chai;
chai.use(testUtils);

Then('it should fail with message {string}', function (message) {
  expect(this.err).to.be.a('Error');
  expect(this.err.message).to.equal(message);
});

Then('it should succeed', function () {
  expect(this.err).to.be.undefined;
});

Then('the latest git version should be {string}', function (version) {
  expect(this.git.latestVersion()).to.equal(version);
});

Then('it should not add a new commit', function () {
  expect(this.git.currentSha()).to.equal(this.oldSha);
});

Then('it should add a new commit', function () {
  expect(this.git.currentSha()).to.not.equal(this.oldSha);
});

Then('it should not have git changes', function () {
  expect(this.git.hasChanges()).to.be.false;
});

Then(
  'the file {string} should have same contents as {string}',
  function (targetFile, sourceFile) {
    const actualFile = path.join(this.tempDirectory, targetFile);
    const expectedFile = fixturePath(sourceFile);
    expect(actualFile).to.have.sameContentsWith(expectedFile);
  }
);

Then('the pom.xml version should be {string}', function (version) {
  return getPomVersion(this.tempDirectory).then(pomVersion => {
    expect(pomVersion).to.equal(version);
  });
});
