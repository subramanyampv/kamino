const fs = require('fs');

// eslint-disable-next-line no-unused-vars
module.exports = function testUtils(chai, utils) {
  const { Assertion } = chai;
  Assertion.addMethod('sameContentsWith', function sameContentsWith(expectedFile) {
    // eslint-disable-next-line no-underscore-dangle
    const actualFile = this._obj;
    if (!actualFile) {
      throw new Error('Actual filename was falsy');
    }

    if (!expectedFile) {
      throw new Error('Expected filename was falsy');
    }

    const expectedContents = fs.readFileSync(expectedFile, 'utf8');
    const actualContents = fs.readFileSync(actualFile, 'utf8');

    this.assert(
      expectedContents === actualContents,
      `Expected file ${actualFile} to have same contents with ${expectedFile}`,
      `Expected file ${actualFile} to have different contents with ${expectedFile}`,
      expectedContents,
      actualContents,
      true
    );
  });
};
