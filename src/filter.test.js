const chai = require('chai');
const sinon = require('sinon');
const childProcess = require('child_process');
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
    sinon.stub(childProcess, 'spawnSync');
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
    describe('when null dir prefix is provided', () => {
      beforeEach(() => {
        cliArgs.dirPrefix = null;
      });

      fn(prevValue);
    });

    describe('when no dir prefix is provided', () => {
      beforeEach(() => {
        cliArgs.dirPrefix = [];
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

  function evalGroup(prevValue, fn) {
    beforeEach(() => {
      path.resolve.withArgs('/c', 'tmp').returns('/c/tmp');
    });

    describe('when no eval script is provided', () => {
      beforeEach(() => {
        cliArgs.evalJs = '';
      });

      fn(prevValue);
    });

    describe('when eval script is provided and returns successfully', () => {
      beforeEach(() => {
        cliArgs.evalJs = 'var x = 42;';
        childProcess.spawnSync.withArgs('node', ['-e', 'var x = 42;'], { cwd: '/c/tmp', stdio: 'ignore' }).returns({
          error: null,
          status: 0,
        });
      });

      fn(prevValue);
    });

    describe('when eval script is provided and returns error', () => {
      beforeEach(() => {
        cliArgs.evalJs = 'var x = 42;';
        childProcess.spawnSync.withArgs('node', ['-e', 'var x = 42;'], { cwd: '/c/tmp', stdio: 'ignore' }).returns({
          error: 'oops',
        });
      });

      fn(false);
    });

    describe('when eval script is provided and returns non-zero exit code', () => {
      beforeEach(() => {
        cliArgs.evalJs = 'var x = 42;';
        childProcess.spawnSync.withArgs('node', ['-e', 'var x = 42;'], { cwd: '/c/tmp', stdio: 'ignore' }).returns({
          status: 1,
        });
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

  const allFunctions = [
    directory,
    dirPrefix,
    hasFile,
    evalGroup,
    act,
  ];

  function callFunctions(prevValue, functions) {
    const [first, ...rest] = functions;
    if (rest.length > 0) {
      first(prevValue, resultOfFirst => callFunctions(resultOfFirst, rest));
    } else {
      first(prevValue);
    }
  }

  function callFirstFunction(functions) {
    const [first, ...rest] = functions;
    first(resultOfFirst => callFunctions(resultOfFirst, rest));
  }

  callFirstFunction(allFunctions);
});
