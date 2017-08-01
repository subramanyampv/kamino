var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var child_process = require('child_process'); // eslint-disable-line camelcase

chai.use(require('chai-as-promised'));
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

    it('should resolve when exec succeeds', () => {
        child_process.exec.withArgs('dummy command') // eslint-disable-line camelcase
            .yields();

        return execPromise('dummy command').then(function(error) {
            expect(child_process.exec).to.have.been.calledWith('dummy command'); // eslint-disable-line camelcase
            expect(error).to.be.null; // eslint-disable-line no-unused-expressions
        });
    });

    it('should resolve when exec fails', () => {
        child_process.exec.withArgs('dummy command') // eslint-disable-line camelcase
            .yields(new Error('command failed'));

        return execPromise('dummy command').then(function(error) {
            expect(child_process.exec).to.have.been.calledWith('dummy command'); // eslint-disable-line camelcase
            expect(error.message).to.equal('command failed');
        });
    });
});
