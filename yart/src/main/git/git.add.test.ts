const proxyquire = require('proxyquire').noCallThru();
import sinon = require('sinon');
import chai = require('chai');
import sinonChai = require('sinon-chai');
import childProcessModule = require('child_process');
const { expect } = chai;
chai.use(sinonChai);

describe('git add', () => {
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

  describe('add', () => {
    it('should add', () => {
      // Arrange
      const git = new Git('.');
      childProcess.spawnSync.returns({});

      // Act
      git.add('test.txt');

      // Assert
      expect(childProcess.spawnSync).calledOnceWith(
        'git',
        [
          'add',
          'test.txt'
        ],
        { cwd: '.', encoding: 'utf8' }
      );
    });

    it('should throw if add failed', () => {
      // Arrange
      const git = new Git('.');
      childProcess.spawnSync.returns({ status: 1 });

      // Act and assert
      expect(() => git.add('test.txt')).to.throw('Could not add');

      // Assert
      expect(childProcess.spawnSync).calledOnceWith(
        'git',
        [
          'add',
          'test.txt'
        ],
        { cwd: '.', encoding: 'utf8' }
      );
    });
  });
});
