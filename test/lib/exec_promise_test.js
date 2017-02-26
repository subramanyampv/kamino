var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var child_process = require('child_process');

chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
require('sinon-as-promised');

describe('exec_promise', () => {
    var sandbox;
    var execPromise;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        sandbox.stub(child_process, 'exec');

        execPromise = proxyquire('../../lib/exec_promise', {
            child_process: child_process
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should resolve when exec succeeds', () => {
        child_process.exec.withArgs('dummy command')
            .yields();

        return execPromise('dummy command').then(function(error) {
            expect(child_process.exec).to.have.been.calledWith('dummy command');
            expect(error).to.be.null;
        });
    });

    it('should resolve when exec fails', () => {
        child_process.exec.withArgs('dummy command')
            .yields(new Error('command failed'));

        return execPromise('dummy command').then(function(error) {
            expect(child_process.exec).to.have.been.calledWith('dummy command');
            expect(error.message).to.equal('command failed');
        });
    });
});
