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
  let cliArgs = null;

  function act(name = 'tmp') {
    run(name, cliArgs);
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

    cliArgs = {
      dir: '/c',
    };

    run = proxyquire('./run.action', {
      child_process: childProcess,
      path,
      '@ngeor/js-cli-logger': logger,
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('when in dry run mode', () => {
    beforeEach(() => {
      cliArgs.dryRun = true;
      cliArgs.args = ['echo', '--hello'];
    });

    it('should log what would have happened', () => {
      act();
      expect(logger.log).calledOnceWith('Would have run command echo --hello in /c/tmp');
      expect(childProcess.spawnSync).not.called;
    });
  });

  describe('when the command does not have extra arguments', () => {
    beforeEach(() => {
      cliArgs.args = ['echo'];
      cliArgs.shell = true;
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
      cliArgs.args = ['echo', 'hello'];
      cliArgs.shell = false;
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
      cliArgs.args = ['echo'];
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
      cliArgs.args = ['echo'];
      childProcess.spawnSync.returns({
        status: 1,
      });
    });

    it('should report an error', () => {
      act();
      expect(logger.error).calledOnceWith('Command returned exit code 1');
    });
  });

  describe('when in csv mode', () => {
    beforeEach(() => {
      cliArgs.csv = true;
      cliArgs.args = ['echo'];
      cliArgs.shell = true;
      childProcess.spawnSync.returns({
        stdout: '13\n',
      });
    });

    it('should run the command', () => {
      act();
      expect(logger.verbose).calledOnceWith('Running command in /c/tmp');
      expect(childProcess.spawnSync).calledOnceWith(
        'echo',
        [],
        {
          cwd: '/c/tmp',
          encoding: 'utf8',
          shell: true,
        },
      );
      expect(logger.log).calledOnceWith('tmp,13');
    });
  });

  describe('when in csv mode with line count', () => {
    beforeEach(() => {
      cliArgs.csv = true;
      cliArgs.lineCount = true;
      cliArgs.args = ['echo'];
      cliArgs.shell = true;
      childProcess.spawnSync.returns({
        stdout: '13\n12\n\n',
      });
    });

    it('should run the command', () => {
      act();
      expect(logger.verbose).calledOnceWith('Running command in /c/tmp');
      expect(childProcess.spawnSync).calledOnceWith(
        'echo',
        [],
        {
          cwd: '/c/tmp',
          encoding: 'utf8',
          shell: true,
        },
      );
      expect(logger.log).calledOnceWith('tmp,2');
    });
  });
});
