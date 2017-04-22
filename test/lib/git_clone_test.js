var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
require('sinon-as-promised');

describe('git_clone', () => {
    var sandbox;
    var fsPromise;
    var execPromise;
    var options;
    var logger;
    var gitClone;
    var cloneInstruction;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        execPromise = sandbox.stub();
        execPromise.resolves(new Error('an error has occurred'));
        options = sandbox.stub(require('../../lib/options'));
        logger = sandbox.stub(require('../../lib/logger'));
        fsPromise = sandbox.stub(require('../../lib/fs_promise'));
        cloneInstruction = {
            name: 'myRepo',
            url: 'https://whatever',
            location: 'whatever-dir'
        };

        gitClone = proxyquire('../../lib/git_clone', {
            './fs_promise': fsPromise,
            'path': {
                join: (a, b) => a + '/' + b,
                resolve: (a, b) => (a + '/' + b).replace('../', 'C:/')
            },
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
            execPromise.withArgs('git clone https://whatever whatever-dir').resolves(null);
            fsPromise.exists.withArgs('whatever-dir').resolves(false);
        });

        it('should call exec only once', () => {
            // act
            return gitClone(cloneInstruction).then(function() {
                expect(execPromise).to.have.been.calledOnce;
            });
        });

        it('should return the expected result', () => {
            // act
            return expect(gitClone(cloneInstruction)).to.eventually.eql({
                cloneResult: 'success',
                location: 'whatever-dir',
                name: 'myRepo',
                url: 'https://whatever'
            });
        });

        it('should log a message', () => {
            return gitClone(cloneInstruction).then(function() {
                expect(logger.log).to.have.been.calledOnce;
            });
        });

        it('should not log an error', () => {
            return gitClone(cloneInstruction).then(function() {
                expect(logger.error).to.not.have.been.called;
            });
        });

        describe('when the dry-run option is specified', () => {
            beforeEach(() => {
                options.isDryRun.returns(true);
            });

            it('should not clone', () => {
                return gitClone(cloneInstruction).then(function() {
                    expect(execPromise).to.not.have.been.called;
                });
            });
        });

        describe('when cloning fails', () => {
            beforeEach(() => {
                execPromise.withArgs('git clone https://whatever whatever-dir').resolves(new Error('cloning has failed'));
            });

            it('should not log a message', () => {
                return gitClone(cloneInstruction).then(function() {
                    expect(logger.log).to.not.have.been.called;
                });
            });

            it('should log an error', () => {
                return gitClone(cloneInstruction).then(function() {
                    expect(logger.error).to.have.been.called;
                });
            });

            it('should return the expected result', () => {
                return expect(gitClone(cloneInstruction)).to.eventually.eql({
                    cloneResult: 'error',
                    location: 'whatever-dir',
                    name: 'myRepo',
                    url: 'https://whatever'
                });
            });
        });
    });

    describe('when the location exists', () => {
        beforeEach(() => {
            execPromise.resolves(null);
            fsPromise.exists.withArgs('whatever-dir').resolves(true);
        });

        it('should not clone', () => {
            return gitClone(cloneInstruction).then(function() {
                expect(execPromise).to.not.have.been.called;
            });
        });

        it('should return the expected result', () => {
            return expect(gitClone(cloneInstruction)).to.eventually.eql({
                location: 'whatever-dir',
                name: 'myRepo',
                cloneResult: 'skip',
                url: 'https://whatever'
            });
        });
    });
});
