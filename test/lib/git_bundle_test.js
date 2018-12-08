/* eslint-disable global-require */
const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai');
const sinon = require('sinon');

const { expect } = chai;
const { expectAsyncError } = require('../util');

chai.use(require('sinon-chai'));

describe('git_bundle', () => {
  let sandbox;
  let fsPromise;
  let execPromise;
  let options;
  let logger;
  let gitBundle;
  let cloneInstruction;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    execPromise = sandbox.stub();
    execPromise.resolves(new Error('an error has occurred'));
    options = {};
    logger = sandbox.stub(require('../../lib/logger'));
    fsPromise = sandbox.stub(require('../../lib/fs_promise'));
    cloneInstruction = {
      name: 'myRepo',
      url: 'https://whatever',
      location: 'whatever-dir',
    };

    gitBundle = proxyquire('../../lib/git_bundle', {
      './fs_promise': fsPromise,
      path: {
        join: (a, b) => `${a}/${b}`,
        resolve: (a, b) => (`${a}/${b}`).replace('../', 'C:/'),
      },
      './exec_promise': execPromise,
      './logger': logger,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('when the location is missing', () => {
    beforeEach(() => {
      execPromise.resolves(null);
      fsPromise.exists.withArgs('whatever-dir').resolves(false);
    });

    it('should not bundle', async () => {
      await gitBundle(cloneInstruction, options);
      expect(execPromise).to.not.have.been.called;
    });

    it('should return the expected result', async () => {
      expect(await gitBundle(cloneInstruction, options)).to.eql('error');
    });
  });

  describe('when the location exists', () => {
    beforeEach(() => {
      execPromise.withArgs('git bundle https://whatever whatever-dir').resolves(null);
      fsPromise.exists.withArgs('whatever-dir').resolves(true);
    });

    describe('when the --bundle-dir option is missing', () => {
      it('should skip bundle', async () => {
        await expectAsyncError(
          () => gitBundle(cloneInstruction, options),
          'Internal error: bundle should not have been called',
        );
      });
    });

    describe('when the --bundle-dir option is specified', () => {
      beforeEach(() => {
        options.bundleDir = '../bundles';
        execPromise.withArgs('git bundle create C:/bundles/myRepo.bundle master', {
          cwd: 'whatever-dir',
        })
          .rejects(new Error('Could not create bundle'));
      });

      describe('when the dry-run option is specified', () => {
        beforeEach(() => {
          options.dryRun = true;
        });

        it('should not clone', async () => {
          await gitBundle(cloneInstruction, options);
          expect(execPromise).to.not.have.been.called;
        });
      });

      it('should create the bundle', async () => {
        // act
        await gitBundle(cloneInstruction, options);

        // assert
        const expectedCommand = 'git bundle create C:/bundles/myRepo.bundle master';
        expect(execPromise).to.have.been.calledWith(expectedCommand, {
          cwd: 'whatever-dir',
        });
      });

      it('should add the error to the result', async () => {
        // act
        expect(await gitBundle(cloneInstruction, options)).to.eql('error');
      });
    });
  });
});
