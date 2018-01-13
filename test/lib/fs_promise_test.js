var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
chai.use(require('sinon-chai'));

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
        it('should resolve to false when the file does not exist', async() => {
            sandbox.stub(fs, 'stat').withArgs('whatever-dir').yields(new Error('not found'));
            expect(await fsPromise.exists('whatever-dir')).to.equal(false);
        });

        it('should resolve to true when the file exists', async() => {
            sandbox.stub(fs, 'stat').withArgs('whatever-dir').yields(null);
            expect(await fsPromise.exists('whatever-dir')).to.equal(true);
        });
    });
});
