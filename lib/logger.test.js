const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();
const { expect } = require('chai');

describe('logger', () => {
  let sandbox;
  let logger;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.spy(console, 'log');
    sandbox.spy(console, 'error');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('when verbose is off', () => {
    beforeEach(() => {
      logger = proxyquire('./logger', {
      });
    });

    it('should not log verbose messages', () => {
      // act
      logger.verbose('hello');

      // assert
      expect(console.log.called).to.eql(false);
    });

    it('should log regular messages', () => {
      // act
      logger.log('hello');

      // assert
      expect(console.log.called).to.eql(true);
    });

    it('should log error messages', () => {
      // act
      logger.error('hello');

      // assert
      expect(console.error.called).to.eql(true);
    });
  });

  describe('when verbose is on', () => {
    beforeEach(() => {
      logger = proxyquire('./logger', {
      });

      logger.setVerboseEnabled(true);
    });

    it('should log verbose messages', () => {
      // act
      logger.verbose('hello');

      // assert
      expect(console.log.called).to.eql(true);
    });

    it('should log regular messages', () => {
      // act
      logger.log('hello');

      // assert
      expect(console.log.called).to.eql(true);
    });

    it('should log error messages', () => {
      // act
      logger.error('hello');

      // assert
      expect(console.error.called).to.eql(true);
    });
  });
});
