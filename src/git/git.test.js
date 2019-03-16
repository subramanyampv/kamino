const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const chai = require('chai');

const { expect } = chai;
chai.use(require('sinon-chai'));

describe('git', () => {
  let gitModule;
  let childProcess;
  let Git;

  beforeEach(() => {
    // eslint-disable-next-line global-require
    childProcess = sinon.stub(require('child_process'));

    gitModule = proxyquire('./git', {
      child_process: childProcess
    });

    // eslint-disable-next-line prefer-destructuring
    Git = gitModule.Git;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('add', () => {
    it('should add', () => {
      // arrange
      const git = new Git('.');
      childProcess.spawnSync.returns({});

      // act
      git.add('test.txt');

      // assert
      expect(childProcess.spawnSync).calledOnceWith(
        'git',
        ['add', 'test.txt'],
        { cwd: '.' },
      );
    });

    it('should throw if add failed', () => {
      // arrange
      const git = new Git('.');
      childProcess.spawnSync.returns({ status: 1 });

      // act and assert
      expect(() => git.add('test.txt')).to.throw('Could not add');

      // assert
      expect(childProcess.spawnSync).calledOnceWith(
        'git',
        ['add', 'test.txt'],
        { cwd: '.' },
      );
    });
  });

  describe('push', () => {
    it('should push and follow tags', () => {
      // arrange
      const git = new Git('.');
      childProcess.spawnSync.returns({});

      // act
      git.push();

      // assert
      expect(childProcess.spawnSync).calledOnceWith(
        'git',
        ['push', '--follow-tags'],
        { cwd: '.' },
      );
    });

    it('should throw if push failed', () => {
      // arrange
      const git = new Git('.');
      childProcess.spawnSync.returns({ status: 1 });

      // act and assert
      expect(() => git.push()).to.throw('Could not push');

      // assert
      expect(childProcess.spawnSync).calledOnceWith(
        'git',
        ['push', '--follow-tags'],
        { cwd: '.' },
      );
    });
  });
});
