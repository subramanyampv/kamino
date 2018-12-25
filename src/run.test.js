const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai');
const sinon = require('sinon');

const { expect } = chai;
chai.use(require('sinon-chai'));

describe('run', () => {
  let childProcess = null;
  let path = null;
  let logger = null;
  let run = null;
  let args = null;

  function act(name = 'tmp') {
    run.runCommand({ name }, args);
  }

  beforeEach(() => {
    childProcess = {
      spawnSync: sinon.stub(),
    };

    path = {
      resolve: (...x) => x.join('/'),
    };

    // eslint-disable-next-line global-require
    logger = sinon.stub(require('@ngeor/js-cli-logger'));

    args = {
      dir: '/c',
    };

    run = proxyquire('./run', {
      child_process: childProcess,
      path,
      '@ngeor/js-cli-logger': logger,
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('when no args are given', () => {
    beforeEach(() => {
      args.args = null;
    });

    it('should only log', () => {
      act();
      expect(logger.log).calledOnceWith('/c/tmp');
      expect(childProcess.spawnSync).not.called;
    });
  });

  describe('when empty args are given', () => {
    beforeEach(() => {
      args.args = [];
    });

    it('should only log', () => {
      act();
      expect(logger.log).calledOnceWith('/c/tmp');
      expect(childProcess.spawnSync).not.called;
    });
  });

  describe('when in dry run mode', () => {
    beforeEach(() => {
      args.args = ['echo'];
      args.dryRun = true;
    });

    it('should not run the command', () => {
      act();
      expect(logger.log).calledOnceWith('Would have run command echo in /c/tmp');
      expect(childProcess.spawnSync).not.called;
    });
  });

  describe('when the command does not have extra arguments', () => {
    beforeEach(() => {
      args.args = ['echo'];
      args.shell = true;
      childProcess.spawnSync.returns({});
    });

    it('should run the command', () => {
      act();
      expect(logger.verbose).calledOnceWith('Running command in /c/tmp');
      expect(childProcess.spawnSync).calledOnceWith(
        'echo',
        [],
        {
          cwd: '/c/tmp',
          stdio: 'inherit',
          shell: true,
        },
      );
    });
  });

  describe('when the command has extra arguments', () => {
    beforeEach(() => {
      args.args = ['echo', 'hello'];
      args.shell = false;
      childProcess.spawnSync.returns({});
    });

    it('should run the command', () => {
      act();
      expect(logger.verbose).calledOnceWith('Running command in /c/tmp');
      expect(childProcess.spawnSync).calledOnceWith(
        'echo',
        ['hello'],
        {
          cwd: '/c/tmp',
          stdio: 'inherit',
          shell: false,
        },
      );
    });
  });

  describe('when the command fails', () => {
    beforeEach(() => {
      args.args = ['echo'];
      childProcess.spawnSync.returns({
        error: 'ENOENT',
      });
    });

    it('should report an error', () => {
      act();
      expect(logger.error).calledOnceWith('Command failed: ENOENT');
    });
  });

  describe('when the command errors', () => {
    beforeEach(() => {
      args.args = ['echo'];
      childProcess.spawnSync.returns({
        status: 1,
      });
    });

    it('should report an error', () => {
      act();
      expect(logger.error).calledOnceWith('Command returned exit code 1');
    });
  });
});
