const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');

const { expect } = require('chai');

describe('exec', () => {
  let exec;
  let childProcess;

  beforeEach(() => {
    childProcess = {
      exec: sinon.stub(),
    };

    exec = proxyquire('./exec', {
      child_process: childProcess,
    });
  });

  it('should resolve when exec succeeds', async () => {
    // arrange
    childProcess.exec.yields(null);

    // act
    const result = await exec('whatever', 'options');

    // assert
    expect(result).to.be.null;
    expect(childProcess.exec).calledOnceWith('whatever', 'options');
  });

  it('should reject when exec fails', async () => {
    // arrange
    childProcess.exec.yields(new Error('oops'));
    let error = null;
    try {
      // act
      await exec('whatever', 'options');
    } catch (e) {
      error = e;
    }

    // assert
    expect(() => { throw error; }).to.throw('oops');
    expect(childProcess.exec).calledOnceWith('whatever', 'options');
  });
});
