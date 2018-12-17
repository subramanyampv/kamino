const chai = require('chai');
const sinon = require('sinon');
const Git = require('./git');

const { expect } = chai;
chai.use(require('sinon-chai'));

describe('git', () => {
  const sandbox = sinon.createSandbox();
  let git;
  let execAsync;

  beforeEach(() => {
    execAsync = sandbox.stub();
    git = new Git(execAsync);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('clone', () => {
    it('should clone', async () => {
      // arrange
      execAsync.resolves(null);

      // act
      await git.clone('https://whatever', '/tmp');

      // assert
      expect(execAsync).calledOnceWith('git clone https://whatever', { cwd: '/tmp' });
    });
  });

  describe('pull', () => {
    it('should pull', async () => {
      // arrange
      execAsync.resolves(null);

      // act
      await git.pull('/tmp/tmp');

      // assert
      expect(execAsync).calledOnceWith('git pull', { cwd: '/tmp/tmp' });
    });
  });
});
