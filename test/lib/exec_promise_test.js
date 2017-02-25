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

    afterEach(function() {
        sandbox.restore();
    });

    it('should resolve when exec succeeds', () => {
        child_process.exec.withArgs('dummy command')
            .yields();

        return execPromise('dummy command').then(function() {
            expect(child_process.exec).to.have.been.calledWith('dummy command');
        });
    });

    it('should resolve when exec fails', () => {
        var _error;
        child_process.exec.withArgs('dummy command')
            .yields(new Error('command failed'));

        return execPromise('dummy command').then(function() {
            expect(child_process.exec).to.have.been.calledWith('dummy command');
        }).catch(function(error) {
            _error = error;
        }).then(function() {
            expect(_error.message).to.equal('command failed');
        });
    });
});
