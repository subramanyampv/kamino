var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
require('sinon-as-promised');

describe('git_clone', () => {
    var sandbox;
    var fs;
    var execPromise;
    var options;
    var logger;
    var gitClone;
    var cloneInstruction;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        fs = require('fs');
        execPromise = sandbox.stub();
        execPromise.resolves(new Error('an error has occurred'));
        options = sandbox.stub(require('../../lib/options'));
        logger = sandbox.stub(require('../../lib/logger'));
        cloneInstruction = {
            name: 'myRepo',
            url: 'https://whatever',
            location: 'whatever-dir'
        };

        gitClone = proxyquire('../../lib/git_clone', {
            fs: fs,
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
            sandbox.stub(fs, 'stat').withArgs('whatever-dir').yields(new Error('not found'));
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
                error: null,
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

        describe('when the --bundle-dir option is specified', () => {
            beforeEach(() => {
                options.getBundleDirectory.returns('../bundles');
                execPromise.withArgs('git bundle create C:/bundles/myRepo.bundle master', { cwd: 'whatever-dir' })
                    .resolves(new Error('Could not create bundle'));
            });

            it('should create the bundle', () => {
                // act
                return gitClone(cloneInstruction).then(function() {
                    // assert
                    expect(execPromise).to.have.been.calledWith('git bundle create C:/bundles/myRepo.bundle master', { cwd: 'whatever-dir' });
                });
            });

            it('should add the error to the result', () => {
                // act
                return expect(gitClone(cloneInstruction)).to.eventually.eql({
                    error: new Error('Could not create bundle'),
                    location: 'whatever-dir',
                    name: 'myRepo',
                    url: 'https://whatever'
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
                    error: new Error('cloning failed'),
                    location: 'whatever-dir',
                    name: 'myRepo',
                    url: 'https://whatever'
                });
            });

            it('should not attempt to bundle', () => {
                // arrange
                options.getBundleDirectory.returns('../bundles');

                // act
                return gitClone(cloneInstruction).then(function() {
                    expect(execPromise).to.have.been.calledOnce;
                });
            });
        });
    });

    describe('when the location exists', () => {
        beforeEach(() => {
            execPromise.resolves(null);
            sandbox.stub(fs, 'stat').withArgs('whatever-dir').yields();
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
                skip: true,
                url: 'https://whatever'
            });
        });
    });
});
