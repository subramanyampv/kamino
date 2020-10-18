const childProcess = require('child_process');
const path = require('path');
const sinon = require('sinon');
const { expect } = require('chai');
const evalJsFilter = require('./eval-js.filter');

describe('eval-js.filter', () => {
  beforeEach(() => {
    sinon.stub(childProcess, 'spawnSync');
    sinon.stub(path, 'resolve');

    path.resolve.withArgs('/c', 'tmp').returns('/c/tmp');
  });

  afterEach(() => sinon.restore());

  it('should match when null evalJs is given', () => {
    expect(evalJsFilter({ name: 'tmp' }, { evalJs: null })).to.be.true;
  });

  it('should match when the process runs successfully', () => {
    childProcess.spawnSync.withArgs(
      'node',
      ['-e', 'var x = 42;'],
      { cwd: '/c/tmp', stdio: 'ignore' },
    ).returns({ status: 0, error: null });

    expect(evalJsFilter({ name: 'tmp' }, { dir: '/c', evalJs: 'var x = 42;' })).to.be.true;
  });

  it('should not match when the process errors', () => {
    childProcess.spawnSync.withArgs(
      'node',
      ['-e', 'var x = 42;'],
      { cwd: '/c/tmp', stdio: 'ignore' },
    ).returns({ status: 0, error: 'oops' });

    expect(evalJsFilter({ name: 'tmp' }, { dir: '/c', evalJs: 'var x = 42;' })).to.be.false;
  });

  it('should not match when the process fails', () => {
    childProcess.spawnSync.withArgs(
      'node',
      ['-e', 'var x = 42;'],
      { cwd: '/c/tmp', stdio: 'ignore' },
    ).returns({ status: 1, error: null });

    expect(evalJsFilter({ name: 'tmp' }, { dir: '/c', evalJs: 'var x = 42;' })).to.be.false;
  });
});
