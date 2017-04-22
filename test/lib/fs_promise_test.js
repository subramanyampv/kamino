var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
require('sinon-as-promised');

describe('fs_promise', () => {
    var sandbox;
    var fs;
    var fsPromise;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        fs = require('fs');
        fsPromise = proxyquire('../../lib/fs_promise', {
            fs: fs
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('exists', () => {
        it('should resolve to false when the file does not exist', () => {
            sandbox.stub(fs, 'stat').withArgs('whatever-dir').yields(new Error('not found'));
            return expect(fsPromise.exists('whatever-dir')).to.eventually.be.false;
        });

        it('should resolve to true when the file exists', () => {
            sandbox.stub(fs, 'stat').withArgs('whatever-dir').yields(null);
            return expect(fsPromise.exists('whatever-dir')).to.eventually.be.true;
        });
    });
});
