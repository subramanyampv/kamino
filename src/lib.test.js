const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai');
const sinon = require('sinon');

const { expect } = chai;
chai.use(require('sinon-chai'));

describe('lib', () => {
  let dirloop = null;
  let fs = null;
  let logger = null;
  let run = null;
  let filter = null;
  let args = null;

  beforeEach(() => {
    fs = {
      readdirSync: sinon.stub().returns([]),
    };

    // eslint-disable-next-line global-require
    logger = sinon.stub(require('@ngeor/js-cli-logger'));

    run = {
      runCommand: sinon.stub(),
    };

    filter = {
      isMatchingDir: sinon.stub(),
    };

    args = {
      parseArguments: sinon.stub(),
    };

    dirloop = proxyquire('./lib', {
      fs,
      '@ngeor/js-cli-logger': logger,
      './args': args,
      './run': run,
      './filter': filter,
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('--verbose', () => {
    describe('verbose off', () => {
      beforeEach(() => {
        args.parseArguments.returns({});
      });

      it('should disable verbose', () => {
        dirloop.main();
        expect(logger.setVerboseEnabled).calledOnceWith(false);
      });
    });

    describe('verbose on', () => {
      beforeEach(() => {
        args.parseArguments.returns({ verbose: true });
      });

      it('should enable verbose', () => {
        dirloop.main();
        expect(logger.setVerboseEnabled).calledOnceWith(true);
      });
    });
  });

  const cliArgs = { dir: '.' };
  beforeEach(() => {
    args.parseArguments.returns(cliArgs);

    const directories = [
      {
        name: 'tmp',
        isDirectory: () => true,
      },
      {
        name: 'temp',
        isDirectory: () => true,
      },
      {
        name: 'temp.txt',
        isDirectory: () => false,
      },
    ];

    fs.readdirSync.withArgs('.', { withFileTypes: true }).returns(directories);
    filter.isMatchingDir.withArgs(
      sinon.match({ name: 'tmp' }),
      cliArgs,
    ).returns(true);
    filter.isMatchingDir.withArgs(
      sinon.match({ name: 'temp' }),
      cliArgs,
    ).returns(true);
    filter.isMatchingDir.withArgs(
      sinon.match({ name: 'temp.txt' }),
      cliArgs,
    ).returns(false);
  });

  it('should run the command', () => {
    dirloop.main();

    expect(run.runCommand).calledWith(
      'tmp',
      cliArgs,
    );
    expect(run.runCommand).calledWith(
      'temp',
      cliArgs,
    );
    expect(run.runCommand).calledTwice;
  });
});
