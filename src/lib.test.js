const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai');
const sinon = require('sinon');

const { expect } = chai;
chai.use(require('sinon-chai'));

describe('lib', () => {
  let dirloop = null;
  let childProcess = null;
  let fs = null;
  let logger = null;
  let path = null;
  let process = null;

  beforeEach(() => {
    childProcess = {
      spawnSync: sinon.stub(),
    };

    fs = {
      readdirSync: sinon.stub(),
    };

    path = {
      resolve: (...args) => args.join('/'),
    };

    process = {
      argv: [],
      exit: sinon.stub().throws(new Error('exit')),
    };

    // eslint-disable-next-line global-require
    logger = sinon.stub(require('@ngeor/js-cli-logger'));

    dirloop = proxyquire('./lib', {
      child_process: childProcess,
      fs,
      path,
      process,
      '@ngeor/js-cli-logger': logger,
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('when the command to run is missing', () => {
    beforeEach(() => {
      process.argv = ['node', 'index.js'];
    });

    it('should exit', () => {
      // act and assert
      expect(() => dirloop.main()).throws('exit');
      expect(process.exit).calledOnceWith(1);
    });
  });

  describe('when the command to run is present', () => {
    beforeEach(() => {
      process.argv = ['node', 'index.js', 'echo'];
    });

    it('should run', () => {
      // arrange
      fs.readdirSync.returns([{
        name: 'tmp',
        isDirectory: () => true,
      }]);

      childProcess.spawnSync.returns({
        status: 0,
      });

      // act
      dirloop.main();

      // assert
      expect(fs.readdirSync).calledOnceWithExactly('.', { withFileTypes: true });
      expect(childProcess.spawnSync).calledOnceWithExactly(
        'echo',
        [],
        {
          cwd: './tmp',
          stdio: 'inherit',
        },
      );
    });
  });

  describe('when the command has parameters', () => {
    beforeEach(() => {
      process.argv = ['node', 'index.js', 'echo', 'hello'];
    });

    it('should run', () => {
      // arrange
      fs.readdirSync.returns([{
        name: 'tmp',
        isDirectory: () => true,
      }]);

      childProcess.spawnSync.returns({
        status: 0,
      });

      // act
      dirloop.main();

      // assert
      expect(fs.readdirSync).calledOnceWithExactly('.', { withFileTypes: true });
      expect(childProcess.spawnSync).calledOnceWithExactly(
        'echo',
        ['hello'],
        {
          cwd: './tmp',
          stdio: 'inherit',
        },
      );
    });
  });

  describe('when only files are found', () => {
    beforeEach(() => {
      process.argv = ['node', 'index.js', 'echo'];
      fs.readdirSync.returns([{
        name: 'tmp',
        isDirectory: () => false,
      }]);
    });

    it('should ignore files', () => {
      // act
      dirloop.main();

      // assert
      expect(fs.readdirSync).calledOnceWithExactly('.', { withFileTypes: true });
      expect(childProcess.spawnSync).not.called;
    });
  });

  describe('when the directory prefix does not match', () => {
    beforeEach(() => {
      process.argv = ['node', 'index.js', '--dir-prefix', 'tmz', 'echo'];
      fs.readdirSync.returns([{
        name: 'tmp',
        isDirectory: () => true,
      }]);
    });

    it('should not run the command', () => {
      // act
      dirloop.main();

      // assert
      expect(fs.readdirSync).calledOnceWithExactly('.', { withFileTypes: true });
      expect(childProcess.spawnSync).not.called;
    });
  });

  describe('when the directory prefix matches', () => {
    beforeEach(() => {
      process.argv = ['node', 'index.js', '--dir-prefix', 'tm', 'echo'];
      fs.readdirSync.returns([{
        name: 'tmp',
        isDirectory: () => true,
      }]);
      childProcess.spawnSync.returns({ status: 0 });
    });

    it('should run the command', () => {
      // act
      dirloop.main();

      // assert
      expect(fs.readdirSync).calledOnceWithExactly('.', { withFileTypes: true });
      expect(childProcess.spawnSync).calledOnce;
    });
  });

  describe('when dry run mode is on', () => {
    beforeEach(() => {
      process.argv = ['node', 'index.js', '--dry-run', 'echo'];
      fs.readdirSync.returns([{
        name: 'tmp',
        isDirectory: () => true,
      }]);
    });

    it('should not run command', () => {
      // act
      dirloop.main();

      // assert
      expect(fs.readdirSync).calledOnceWithExactly('.', { withFileTypes: true });
      expect(childProcess.spawnSync).not.called;
    });
  });

  describe('when the command fails', () => {
    beforeEach(() => {
      process.argv = ['node', 'index.js', 'echo'];
    });

    it('should run', () => {
      // arrange
      fs.readdirSync.returns([{
        name: 'tmp',
        isDirectory: () => true,
      }]);

      childProcess.spawnSync.returns({
        status: 1,
      });

      // act
      dirloop.main();

      // assert
      expect(logger.error).calledOnceWith('Command returned exit code 1');
    });
  });
});
