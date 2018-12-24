/* eslint-disable no-console */
const sinon = require('sinon');
const chai = require('chai');
const { expect } = require('chai');
const logger = require('./index');
chai.use(require('sinon-chai'));

describe('logger', () => {
  beforeEach(() => {
    sinon.spy(console, 'log');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('log', () => {
    it('should log a message', () => {
      logger.log('hello');
      expect(console.log).calledOnceWith('hello');
    });
  });

  describe('info', () => {
    it('should log a message', () => {
      logger.info('hello world');
      expect(console.log).calledOnceWith('hello world');
    });
  });

  describe('verbose', () => {
    it('should not log a message by default', () => {
      logger.verbose('hello world');
      expect(console.log).not.called;
    });

    it('should log a message after enabling verbosity', () => {
      logger.setVerboseEnabled(true);
      logger.verbose('hello world');
      expect(console.log).calledOnceWith('hello world');
    });
  });
});
