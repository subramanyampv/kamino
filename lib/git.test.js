const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

const { expect } = chai;
chai.use(require('sinon-chai'));

describe('git', () => {
  const sandbox = sinon.createSandbox();
  let git;
  let childProcess;
  let optionsParser;

  beforeEach(() => {
    childProcess = {
      spawnSync: sandbox.stub(),
    };

    // eslint-disable-next-line global-require
    optionsParser = sandbox.stub(require('./options_parser'));
    git = proxyquire('./git', {
      child_process: childProcess,
      './optionsParser': optionsParser,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('clone', () => {
    it('should clone', () => {
      // arrange
      optionsParser.get.returns({});
      childProcess.spawnSync.returns({ status: 0 });

      // act
      git.clone('https://whatever', '/tmp');

      // assert
      expect(childProcess.spawnSync).calledOnceWith('git', ['clone', 'https://whatever'], { cwd: '/tmp' });
    });

    it('should raise an error if the clone fails', () => {
      // arrange
      optionsParser.get.returns({});
      childProcess.spawnSync.returns({ status: 1 });

      // act
      expect(() => git.clone('https://whatever', '/tmp')).throws('Command failed');

      // assert
      expect(childProcess.spawnSync).calledOnceWith('git', ['clone', 'https://whatever'], { cwd: '/tmp' });
    });

    it('should not clone in dry run mode', () => {
      // arrange
      optionsParser.get.returns({ dryRun: true });

      // act
      git.clone('https://whatever', '/tmp');

      // assert
      expect(childProcess.spawnSync).not.called;
    });
  });
});
