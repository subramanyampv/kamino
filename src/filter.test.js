const chai = require('chai');
const sinon = require('sinon');
const path = require('path');
const fs = require('fs');
const filter = require('./filter');

const { expect } = chai;
chai.use(require('sinon-chai'));

describe('filter', () => {
  const file = {};
  const cliArgs = {};

  beforeEach(() => {
    file.name = 'tmp';
    file.isDirectory = sinon.stub();
    cliArgs.dir = '/c';

    sinon.stub(path, 'resolve');
    sinon.stub(fs, 'existsSync');
  });

  afterEach(() => sinon.restore());

  function directory(fn) {
    describe('when it is a directory', () => {
      beforeEach(() => {
        file.isDirectory.returns(true);
      });

      fn(true);
    });

    describe('when it is not a directory', () => {
      beforeEach(() => {
        file.isDirectory.returns(false);
      });

      fn(false);
    });
  }

  function dirPrefix(prevValue, fn) {
    describe('when no dir prefix is provided', () => {
      beforeEach(() => {
        cliArgs.dirPrefix = null;
      });

      fn(prevValue);
    });

    describe('when provided dir prefix matches', () => {
      beforeEach(() => {
        cliArgs.dirPrefix = ['t'];
      });

      fn(prevValue);
    });


    describe('when provided dir prefix does not match', () => {
      beforeEach(() => {
        cliArgs.dirPrefix = ['m'];
      });

      fn(false);
    });
  }

  function hasFile(prevValue, fn) {
    describe('when --has-file is not provided', () => {
      beforeEach(() => {
        cliArgs.hasFile = null;
      });

      fn(prevValue);
    });

    describe('when requested file exists', () => {
      beforeEach(() => {
        cliArgs.hasFile = 'pom.xml';
        path.resolve.withArgs('/c', 'tmp', 'pom.xml').returns('/c/tmp/pom.xml');
        fs.existsSync.withArgs('/c/tmp/pom.xml').returns(true);
      });

      fn(prevValue);
    });

    describe('when requested file does not exist', () => {
      beforeEach(() => {
        cliArgs.hasFile = 'pom.xml';
        path.resolve.withArgs('/c', 'tmp', 'pom.xml').returns('/c/tmp/pom.xml');
        fs.existsSync.withArgs('/c/tmp/pom.xml').returns(false);
      });

      fn(false);
    });
  }

  function act(expectedResult) {
    if (expectedResult) {
      it('should match', () => {
        expect(filter.isMatchingDir(file, cliArgs)).to.be.true;
      });
    } else {
      it('should not match', () => {
        expect(filter.isMatchingDir(file, cliArgs)).to.be.false;
      });
    }
  }

  directory((expectedResultOfDirectory) => {
    dirPrefix(expectedResultOfDirectory, (expectedResultOfDirPrefix) => {
      hasFile(expectedResultOfDirPrefix, (expectedResultOfHasFile) => {
        act(expectedResultOfHasFile);
      });
    });
  });
});
