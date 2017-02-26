var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
require('sinon-as-promised');

describe('GitClone', () => {
    var sandbox;
    var fs;
    var execPromise;
    var GitClone;
    var options;
    var logger;
    var gitClone;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        fs = require('fs');
        execPromise = sandbox.stub();
        options = sandbox.stub(require('../../lib/options'));
        logger = sandbox.stub(require('../../lib/logger'));

        GitClone = proxyquire('../../lib/GitClone', {
            fs: fs,
            './exec_promise': execPromise,
            './options': options,
            './logger': logger
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('when the location is missing', () => {
        beforeEach(() => {
            execPromise.resolves(null);
            sandbox.stub(fs, 'stat').withArgs('whatever-dir').yields(new Error('not found'));
            gitClone = new GitClone({
                cloneUrl: 'https://whatever',
                cloneLocation: 'whatever-dir'
            });
        });

        it('should call exec only once', () => {
            // act
            return gitClone.clone().then(function() {
                expect(execPromise).to.have.been.calledOnce;
            });
        });

        it('should call exec with the expected arguments', () => {
            // act
            return gitClone.clone().then(function() {
                expect(execPromise).to.have.been.calledWith('git clone https://whatever whatever-dir');
            });
        });

        it('should return the expected result', () => {
            // act
            return expect(gitClone.clone()).to.eventually.eql({
                cloneLocation: 'whatever-dir',
                error: null
            });
        });

        it('should log a message', () => {
            return gitClone.clone().then(function() {
                expect(logger.log).to.have.been.calledOnce;
            });
        });

        it('should not log an error', () => {
            return gitClone.clone().then(function() {
                expect(logger.error).to.not.have.been.called;
            });
        });

        describe('when the dry-run option is specified', () => {
            beforeEach(() => {
                options.isDryRun.returns(true);
            });

            it('should not clone', () => {
                return gitClone.clone().then(function() {
                    expect(execPromise).to.not.have.been.called;
                });
            });
        });

        describe('when cloning fails', () => {
            beforeEach(() => {
                execPromise.resolves(new Error('cloning failed'));
            });

            it('should not log a message', () => {
                return gitClone.clone().then(function() {
                    expect(logger.log).to.not.have.been.called;
                });
            });

            it('should log an error', () => {
                return gitClone.clone().then(function() {
                    expect(logger.error).to.have.been.called;
                });
            });

            it('should return the expected result', () => {
                // act
                return expect(gitClone.clone()).to.eventually.eql({
                    cloneLocation: 'whatever-dir',
                    error: new Error('cloning failed')
                });
            });
        });
    });

    describe('when the location exists', () => {
        beforeEach(() => {
            execPromise.resolves(null);
            sandbox.stub(fs, 'stat').withArgs('whatever-dir').yields();
            gitClone = new GitClone({
                cloneUrl: 'https://whatever',
                cloneLocation: 'whatever-dir'
            });
        });

        it('should not clone', () => {
            return gitClone.clone().then(function() {
                expect(execPromise).to.not.have.been.called;
            });
        });

        it('should return the expected result', () => {
            return expect(gitClone.clone()).to.eventually.eql({
                cloneLocation: 'whatever-dir',
                skip: true
            });
        });
    });
});
