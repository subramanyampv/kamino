const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai');
const sinon = require('sinon');

const { expect } = chai;
chai.use(require('sinon-chai'));

describe('run', () => {
  let path;
  let logger;
  let run;
  let cliArgs;
  let runAction;
  let setJsonAction;

  function act() {
    return run.runCommand('tmp', cliArgs);
  }

  beforeEach(() => {
    runAction = sinon.stub();
    setJsonAction = sinon.stub();

    path = {
      resolve: (...x) => x.join('/'),
    };

    // eslint-disable-next-line global-require
    logger = sinon.stub(require('@ngeor/js-cli-logger'));

    cliArgs = {
      dir: '/c',
    };

    run = proxyquire('./run', {
      path,
      '@ngeor/js-cli-logger': logger,
      './actions/run.action': runAction,
      './actions/set-json.action': setJsonAction,
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('when no args are given', () => {
    beforeEach(() => {
      cliArgs.args = null;
    });

    it('should only log', () => {
      const result = act();
      expect(logger.log).calledOnceWith('/c/tmp');
      expect(runAction).not.called;
      expect(setJsonAction).not.called;
      expect(result).to.be.false;
    });
  });

  describe('when empty args are given', () => {
    beforeEach(() => {
      cliArgs.args = [];
    });

    it('should only log', () => {
      const result = act();
      expect(logger.log).calledOnceWith('/c/tmp');
      expect(runAction).not.called;
      expect(setJsonAction).not.called;
      expect(result).to.be.false;
    });
  });

  describe('when running an external command', () => {
    beforeEach(() => {
      cliArgs.args = ['echo'];
    });

    it('should run the command', () => {
      // arrange
      runAction.returns(false);

      // act
      const result = act();

      // assert
      expect(runAction).calledOnceWith(
        'tmp',
        cliArgs,
      );
      expect(setJsonAction).not.called;
      expect(result).to.be.false;
    });


    it('should return true if the command failed', () => {
      // arrange
      runAction.returns(true);

      // act
      const result = act();

      // assert
      expect(runAction).calledOnceWith(
        'tmp',
        cliArgs,
      );
      expect(setJsonAction).not.called;
      expect(result).to.be.true;
    });
  });

  describe('when setting json', () => {
    beforeEach(() => {
      cliArgs.setJson = 'package.json;j.devDependencies.eslint = \'^5.11.0\';';
    });

    it('should set the json', () => {
      const result = act();
      expect(setJsonAction).calledOnceWith(
        'tmp',
        cliArgs,
      );
      expect(runAction).not.called;
      expect(result).to.be.false;
    });
  });
});
