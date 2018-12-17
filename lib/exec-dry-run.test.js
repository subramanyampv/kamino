const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const { expect } = require('chai');

describe('exec-dry-run', () => {
  let execDryRun;
  let logger;

  beforeEach(() => {
    // eslint-disable-next-line global-require
    logger = sinon.stub(require('./logger'));
    execDryRun = proxyquire('./exec-dry-run', {
      './logger': logger,
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should log and resolve', async () => {
    // act
    const result = await execDryRun('whatever', { cwd: '/tmp' });

    // assert
    expect(result).to.be.null;
    expect(logger.log).calledOnceWithExactly('Would have run command whatever in directory /tmp');
  });
});
