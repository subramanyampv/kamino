var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var child_process = require('child_process'); // eslint-disable-line camelcase

chai.use(require('sinon-chai'));

describe('exec_promise', () => {
    var sandbox;
    var execPromise;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        sandbox.stub(child_process, 'exec');

        execPromise = proxyquire('../../lib/exec_promise', {
            child_process: child_process // eslint-disable-line camelcase
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should resolve when exec succeeds', async() => {
        child_process.exec.withArgs('dummy command') // eslint-disable-line camelcase
            .yields();

        await execPromise('dummy command');
        expect(child_process.exec).to.have.been.calledWith('dummy command'); // eslint-disable-line camelcase
    });

    it('should reject when exec fails', async() => {
        child_process.exec.withArgs('dummy command') // eslint-disable-line camelcase
            .yields(new Error('command failed'));

        let error = null;
        try {
            await execPromise('dummy command');
        } catch (e) {
            error = e;
        }

        expect(child_process.exec).to.have.been.calledWith('dummy command'); // eslint-disable-line camelcase
        expect(error.message).to.equal('command failed');
    });
});
