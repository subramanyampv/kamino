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
  let oldArgV = null;

  beforeEach(() => {
    oldArgV = process.argv;
    process.argv = [];
    childProcess = {
      spawnSync: sinon.stub(),
    };

    fs = {
      existsSync: sinon.stub(),
      readdirSync: sinon.stub(),
    };

    path = {
      resolve: (...args) => args.join('/'),
    };

    childProcess['@global'] = true;
    fs['@global'] = true;
    path['@global'] = true;

    // eslint-disable-next-line global-require
    logger = sinon.stub(require('@ngeor/js-cli-logger'));
    logger['@global'] = true;

    dirloop = proxyquire('./lib', {
      child_process: childProcess,
      fs,
      path,
      '@ngeor/js-cli-logger': logger,
    });
  });

  afterEach(() => {
    sinon.restore();
    process.argv = oldArgV;
  });

  describe('when the command to run is missing', () => {
    beforeEach(() => {
      process.argv = ['node', 'index.js'];
    });

    it('should print the directories', () => {
      // arrange
      fs.readdirSync.returns([{
        name: 'tmp',
        isDirectory: () => true,
      }]);

      // act
      dirloop.main();

      // assert
      expect(fs.readdirSync).calledOnceWithExactly('.', { withFileTypes: true });
      expect(childProcess.spawnSync).not.called;
      expect(logger.log).calledOnceWithExactly('./tmp');
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
      expect(logger.verbose).calledOnceWithExactly('Running command in ./tmp');
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

  describe('--dir-prefix', () => {
    beforeEach(() => {
      fs.readdirSync.returns([
        {
          name: 'tmp',
          isDirectory: () => true,
        },
        {
          name: 'temp',
          isDirectory: () => true,
        },
      ]);
      childProcess.spawnSync.returns({ status: 0 });
    });

    describe('when the directory prefix does not match', () => {
      beforeEach(() => {
        process.argv = ['node', 'index.js', '--dir-prefix', 'tmz', 'echo'];
      });

      it('should not run the command', () => {
        // act
        dirloop.main();

        // assert
        expect(childProcess.spawnSync).not.called;
      });
    });

    describe('when the directory prefix matches one directory', () => {
      beforeEach(() => {
        process.argv = ['node', 'index.js', '--dir-prefix', 'tm', 'echo'];
      });

      it('should run the command', () => {
        // act
        dirloop.main();

        // assert
        expect(childProcess.spawnSync).calledOnce;
      });
    });

    describe('when the directory prefix matches two directories', () => {
      beforeEach(() => {
        process.argv = ['node', 'index.js', '--dir-prefix', 't', 'echo'];
      });

      it('should run the command twice', () => {
        // act
        dirloop.main();

        // assert
        expect(childProcess.spawnSync).calledTwice;
        expect(childProcess.spawnSync).calledWith('echo', [], { cwd: './tmp', stdio: 'inherit' });
        expect(childProcess.spawnSync).calledWith('echo', [], { cwd: './temp', stdio: 'inherit' });
      });
    });

    describe('when given multiple prefixes', () => {
      beforeEach(() => {
        process.argv = ['node', 'index.js', '--dir-prefix', 'temp,tmp', 'echo'];
      });

      it('should run the command twice', () => {
        // act
        dirloop.main();

        // assert
        expect(childProcess.spawnSync).calledTwice;
        expect(childProcess.spawnSync).calledWith('echo', [], { cwd: './tmp', stdio: 'inherit' });
        expect(childProcess.spawnSync).calledWith('echo', [], { cwd: './temp', stdio: 'inherit' });
      });
    });

    describe('when using also a has-file filter', () => {
      beforeEach(() => {
        process.argv = ['node', 'index.js', '--dir-prefix', 'temp,tmp', '--has-file', 'pom.xml', 'echo'];
        fs.existsSync.withArgs('./tmp/pom.xml').returns(true);
      });

      it('should match only one directory', () => {
        // act
        dirloop.main();

        // assert
        expect(childProcess.spawnSync).calledOnceWith('echo', [], { cwd: './tmp', stdio: 'inherit' });
      });
    });
  });

  describe('--dry-run', () => {
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
        expect(logger.log).calledOnceWithExactly('Would have run command echo in ./tmp');
      });
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

  describe('--has-file', () => {
    beforeEach(() => {
      process.argv = ['node', 'index.js', '--has-file', 'pom.xml', 'echo'];
      fs.readdirSync.returns([{
        name: 'tmp',
        isDirectory: () => true,
      }]);

      childProcess.spawnSync.returns({
        status: 0,
      });
    });

    describe('when the file exists', () => {
      beforeEach(() => {
        fs.existsSync.returns(true);
      });

      it('should run the command', () => {
        // act
        dirloop.main();

        // assert
        expect(childProcess.spawnSync).calledOnce;
        expect(fs.existsSync).calledOnceWithExactly('./tmp/pom.xml');
      });
    });

    describe('when the file does not exist', () => {
      beforeEach(() => {
        fs.existsSync.returns(false);
      });

      it('should not run the command', () => {
        // act
        dirloop.main();

        // assert
        expect(childProcess.spawnSync).not.called;
        expect(fs.existsSync).calledOnceWithExactly('./tmp/pom.xml');
      });
    });
  });
});
