const proxyquire = require('proxyquire').noCallThru();

const { expect } = require('chai');

describe('exec.factory', () => {
  let execFactory;

  beforeEach(() => {
    execFactory = proxyquire('./exec.factory', {
      './exec': 'exec',
      './exec-dry-run': 'execDryRun',
    });
  });

  it('should return normal exec', () => {
    expect(execFactory({ dryRun: false })).to.eql('exec');
  });

  it('should return dry run exec', () => {
    expect(execFactory({ dryRun: true })).to.eql('execDryRun');
  });
});
