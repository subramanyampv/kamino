/* eslint-disable @typescript-eslint/no-namespace */
import fs = require('fs');

declare global {
  namespace Chai {
    interface Assertion {
      sameContentsWith(expectedFile: string): Assertion;
    }
  }
}

export function testUtils(chai): void {
  const { Assertion } = chai;
  Assertion.addMethod('sameContentsWith', function (expectedFile) {
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
      `Expected file ${actualFile} to not have same contents with ${expectedFile}`,
      expectedContents,
      actualContents,
      true
    );
  });
};
