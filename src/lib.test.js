const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai');
const sinon = require('sinon');

const { expect } = chai;
chai.use(require('sinon-chai'));

describe('lib', () => {
  let dirloop = null;
  let fs = null;
  let logger = null;
  let path = null;
  let oldArgV = null;
  let run = null;

  function assertRun(dir, args) {
    expect(run.runCommand).calledWith(
      sinon.match({ name: dir }, args),
    );
  }

  beforeEach(() => {
    oldArgV = process.argv;
    process.argv = [];

    fs = {
      existsSync: sinon.stub(),
      readdirSync: sinon.stub(),
    };

    path = {
      resolve: (...args) => args.join('/'),
    };

    fs['@global'] = true;
    path['@global'] = true;

    // eslint-disable-next-line global-require
    logger = sinon.stub(require('@ngeor/js-cli-logger'));
    logger['@global'] = true;

    run = {
      runCommand: sinon.stub(),
    };

    dirloop = proxyquire('./lib', {
      fs,
      path,
      '@ngeor/js-cli-logger': logger,
      './run': run,
    });
  });

  afterEach(() => {
    sinon.restore();
    process.argv = oldArgV;
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
      expect(run.runCommand).not.called;
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
    });

    describe('when the directory prefix does not match', () => {
      beforeEach(() => {
        process.argv = ['node', 'index.js', '--dir-prefix', 'tmz', 'echo'];
      });

      it('should not run the command', () => {
        // act
        dirloop.main();

        // assert
        expect(run.runCommand).not.called;
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
        expect(run.runCommand).calledOnce;
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
        expect(run.runCommand).calledTwice;
        assertRun('tmp', { dir: '.', args: ['echo'] });
        assertRun('temp', { dir: '.', args: ['echo'] });
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
        expect(run.runCommand).calledTwice;
        assertRun('tmp', { dir: '.', args: ['echo'] });
        assertRun('temp', { dir: '.', args: ['echo'] });
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
        expect(run.runCommand).calledOnce;
        assertRun('tmp', { dir: '.', args: ['echo'] });
      });
    });
  });

  describe('--has-file', () => {
    beforeEach(() => {
      process.argv = ['node', 'index.js', '--has-file', 'pom.xml', 'echo'];
      fs.readdirSync.returns([{
        name: 'tmp',
        isDirectory: () => true,
      }]);
    });

    describe('when the file exists', () => {
      beforeEach(() => {
        fs.existsSync.returns(true);
      });

      it('should run the command', () => {
        // act
        dirloop.main();

        // assert
        expect(run.runCommand).calledOnce;
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
        expect(run.runCommand).not.called;
        expect(fs.existsSync).calledOnceWithExactly('./tmp/pom.xml');
      });
    });
  });
});
