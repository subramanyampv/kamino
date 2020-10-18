const proxyquire = require('proxyquire').noCallThru();
import sinon = require('sinon');
import chai = require('chai');
import sinonChai = require('sinon-chai');
import childProcessModule = require('child_process');
const { expect } = chai;
chai.use(sinonChai);

describe('git', () => {
  let gitModule;
  let childProcess;
  let Git;

  beforeEach(() => {
    childProcess = sinon.stub(childProcessModule);

    gitModule = proxyquire('./git', {
      'child_process': childProcess
    });

    // eslint-disable-next-line prefer-destructuring
    Git = gitModule.Git;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('push', () => {
    it('should push and follow tags', () => {
      // Arrange
      const git = new Git('.');
      childProcess.spawnSync.returns({});

      // Act
      git.push();

      // Assert
      expect(childProcess.spawnSync).calledOnceWith(
        'git',
        [
          'push',
          '--follow-tags'
        ],
        { cwd: '.', encoding: 'utf8' }
      );
    });

    it('should throw if push failed', () => {
      // Arrange
      const git = new Git('.');
      childProcess.spawnSync.returns({ status: 1 });

      // Act and assert
      expect(() => git.push()).to.throw('Could not push');

      // Assert
      expect(childProcess.spawnSync).calledOnceWith(
        'git',
        [
          'push',
          '--follow-tags'
        ],
        { cwd: '.', encoding: 'utf8' }
      );
    });
  });
});
