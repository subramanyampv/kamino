/* eslint-disable global-require */
const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai');
const sinon = require('sinon');

const { expect } = chai;
chai.use(require('sinon-chai'));

describe('fs_promise', () => {
  let sandbox;
  let fs;
  let fsPromise;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    fs = require('fs');
    fsPromise = proxyquire('../../lib/fs_promise', {
      fs,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('exists', () => {
    it('should resolve to false when the file does not exist', async () => {
      sandbox.stub(fs, 'stat').withArgs('whatever-dir').yields(new Error('not found'));
      expect(await fsPromise.exists('whatever-dir')).to.equal(false);
    });

    it('should resolve to true when the file exists', async () => {
      sandbox.stub(fs, 'stat').withArgs('whatever-dir').yields(null);
      expect(await fsPromise.exists('whatever-dir')).to.equal(true);
    });
  });
});
