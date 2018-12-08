const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai');

const { expect } = chai;
const sinon = require('sinon');
const childProcess = require('child_process'); // eslint-disable-line camelcase

chai.use(require('sinon-chai'));

describe('exec_promise', () => {
  let sandbox;
  let execPromise;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(childProcess, 'exec');

    execPromise = proxyquire('../../lib/exec_promise', {
      childProcess,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should resolve when exec succeeds', async () => {
    childProcess.exec.withArgs('dummy command')
      .yields();

    await execPromise('dummy command');
    expect(childProcess.exec).to.have.been.calledWith('dummy command');
  });

  it('should reject when exec fails', async () => {
    childProcess.exec.withArgs('dummy command')
      .yields(new Error('command failed'));

    let error = null;
    try {
      await execPromise('dummy command');
    } catch (e) {
      error = e;
    }

    expect(childProcess.exec).to.have.been.calledWith('dummy command');
    expect(error.message).to.equal('command failed');
  });
});
