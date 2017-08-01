var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));

describe('git_bundle', () => {
    var sandbox;
    var fsPromise;
    var execPromise;
    var options;
    var logger;
    var gitBundle;
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

        gitBundle = proxyquire('../../lib/git_bundle', {
            './fs_promise': fsPromise,
            path: {
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
            execPromise.resolves(null);
            fsPromise.exists.withArgs('whatever-dir').resolves(false);
        });

        it('should not bundle', () => {
            return gitBundle(cloneInstruction).then(function() {
                expect(execPromise).to.not.have.been.called; // eslint-disable-line no-unused-expressions
            });
        });

        it('should return the expected result', () => {
            return expect(gitBundle(cloneInstruction)).to.eventually.eql({
                location: 'whatever-dir',
                name: 'myRepo',
                bundleResult: 'error',
                url: 'https://whatever'
            });
        });
    });

    describe('when the location exists', () => {
        beforeEach(() => {
            execPromise.withArgs('git bundle https://whatever whatever-dir').resolves(null);
            fsPromise.exists.withArgs('whatever-dir').resolves(true);
        });

        describe('when the --bundle-dir option is missing', () => {
            it('should skip bundle', () => {
                return expect(gitBundle(cloneInstruction)).to.eventually.eql({
                    location: 'whatever-dir',
                    name: 'myRepo',
                    bundleResult: 'skip',
                    url: 'https://whatever'
                });
            });
        });

        describe('when the --bundle-dir option is specified', () => {
            beforeEach(() => {
                options.getBundleDirectory.returns('../bundles');
                execPromise.withArgs('git bundle create C:/bundles/myRepo.bundle master', { cwd: 'whatever-dir' })
                    .resolves(new Error('Could not create bundle'));
            });

            describe('when the dry-run option is specified', () => {
                beforeEach(() => {
                    options.isDryRun.returns(true);
                });

                it('should not clone', () => {
                    return gitBundle(cloneInstruction).then(function() {
                        expect(execPromise).to.not.have.been.called; // eslint-disable-line no-unused-expressions
                    });
                });
            });

            it('should create the bundle', () => {
                // act
                return gitBundle(cloneInstruction).then(function() {
                    // assert
                    expect(execPromise).to.have.been.calledWith('git bundle create C:/bundles/myRepo.bundle master', { cwd: 'whatever-dir' });
                });
            });

            it('should add the error to the result', () => {
                // act
                return expect(gitBundle(cloneInstruction)).to.eventually.eql({
                    bundleResult: 'error',
                    location: 'whatever-dir',
                    name: 'myRepo',
                    url: 'https://whatever'
                });
            });
        });
    });
});
