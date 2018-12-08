/* eslint-disable global-require */
const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai');
const sinon = require('sinon');

const { expect } = chai;
chai.use(require('sinon-chai'));

describe('git_clone', () => {
  let sandbox;
  let fsPromise;
  let execPromise;
  let options;
  let logger;
  let gitClone;
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

    gitClone = proxyquire('../../lib/git_clone', {
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
      execPromise.withArgs('git clone https://whatever whatever-dir').resolves(null);
      fsPromise.exists.withArgs('whatever-dir').resolves(false);
    });

    it('should call exec only once', async () => {
      // act
      await gitClone(cloneInstruction, options);
      expect(execPromise).to.have.been.calledOnce;
    });

    it('should return the expected result', async () => {
      // act
      expect(await gitClone(cloneInstruction, options)).to.eql('success');
    });

    it('should log a message', async () => {
      await gitClone(cloneInstruction, options);
      expect(logger.log).to.have.been.calledOnce;
    });

    it('should not log an error', async () => {
      await gitClone(cloneInstruction, options);
      expect(logger.error).to.not.have.been.called;
    });

    describe('when the dry-run option is specified', () => {
      beforeEach(() => {
        options.dryRun = true;
      });

      it('should not clone', async () => {
        await gitClone(cloneInstruction, options);
        expect(execPromise).to.not.have.been.called;
      });
    });

    describe('when cloning fails', () => {
      beforeEach(() => {
        execPromise
          .withArgs('git clone https://whatever whatever-dir')
          .rejects(new Error('cloning has failed'));
      });

      it('should not log a message', async () => {
        await gitClone(cloneInstruction, options);
        expect(logger.log).to.not.have.been.called;
      });

      it('should log an error', async () => {
        await gitClone(cloneInstruction, options);
        expect(logger.error).to.have.been.called;
      });

      it('should return the expected result', async () => {
        expect(await gitClone(cloneInstruction, options)).to.eql('error');
      });
    });
  });

  describe('when the location exists', () => {
    beforeEach(() => {
      execPromise.resolves(null);
      fsPromise.exists.withArgs('whatever-dir').resolves(true);
    });

    it('should not clone', async () => {
      await gitClone(cloneInstruction, options);
      expect(execPromise).to.not.have.been.called;
    });

    it('should return the expected result', async () => {
      expect(await gitClone(cloneInstruction, options)).to.eql('skip');
    });
  });
});
