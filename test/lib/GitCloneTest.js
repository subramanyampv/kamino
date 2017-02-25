var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var process = require('process');
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
require('sinon-as-promised');

describe('GitClone', () => {
    var sandbox;
    var fs;
    var execPromise;
    var GitClone;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        fs = require('fs');
        execPromise = sandbox.stub();

        GitClone = proxyquire('../../lib/GitClone', {
            fs: fs,
            './exec_promise': execPromise
        });
    });

    afterEach(() => {
        sandbox.restore();
        process.argv = [];
    });

    it('should clone when the location is missing', () => {
        // arrange
        var gitClone = new GitClone({
            cloneUrl: 'https://whatever',
            cloneLocation: 'whatever-dir'
        });
        execPromise.resolves(true);
        sandbox.stub(fs, 'stat').withArgs('whatever-dir').yields(new Error('not found'));

        // act
        return gitClone.clone().then(function() {
            expect(execPromise).to.have.been.calledOnce;
            expect(execPromise).to.have.been.calledWith('git clone https://whatever whatever-dir');
        });
    });

    it('should not clone when the location exists', () => {
        // arrange
        var gitClone = new GitClone({
            cloneUrl: 'https://whatever',
            cloneLocation: 'whatever-dir'
        });
        execPromise.resolves(true);
        sandbox.stub(fs, 'stat').withArgs('whatever-dir').yields();

        // act
        return gitClone.clone().then(function() {
            expect(execPromise).to.not.have.been.called;
        });
    });

    it('should not clone when the dry-run option is specified', () => {
        // arrange
        var gitClone = new GitClone({
            cloneUrl: 'https://whatever',
            cloneLocation: 'whatever-dir'
        });
        execPromise.resolves(true);
        sandbox.stub(fs, 'stat').withArgs('whatever-dir').yields(new Error('not found'));
        process.argv = ['--dry-run'];

        // act
        return gitClone.clone().then(function() {
            expect(execPromise).to.not.have.been.called;
        });
    });
});
