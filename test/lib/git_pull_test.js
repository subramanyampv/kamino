var proxyquire = require('proxyquire').noCallThru();
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
chai.use(require('sinon-chai'));

describe('git_pull', () => {
    var sandbox;
    var fsPromise;
    var execPromise;
    var logger;
    var gitPull;
    var cloneInstruction;
    let options = null;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        execPromise = sandbox.stub();
        execPromise.resolves(new Error('an error has occurred'));
        logger = sandbox.stub(require('../../lib/logger'));
        fsPromise = sandbox.stub(require('../../lib/fs_promise'));
        cloneInstruction = {
            name: 'myRepo',
            url: 'https://whatever',
            location: 'whatever-dir'
        };

        gitPull = proxyquire('../../lib/git_pull', {
            './fs_promise': fsPromise,
            path: {
                join: (a, b) => a + '/' + b,
                resolve: (a, b) => (a + '/' + b).replace('../', 'C:/')
            },
            './exec_promise': execPromise,
            './logger': logger
        });

        options = {};
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('when the location is missing', () => {
        beforeEach(() => {
            execPromise.resolves(null);
            fsPromise.exists.withArgs('whatever-dir').resolves(false);
        });

        it('should not pull', () => {
            return gitPull(cloneInstruction, options).then(function() {
                expect(execPromise).to.not.have.been.called;
            });
        });

        it('should return the expected result', async() => {
            expect(await gitPull(cloneInstruction, options)).to.eql({
                location: 'whatever-dir',
                name: 'myRepo',
                pullResult: 'error',
                url: 'https://whatever'
            });
        });
    });

    describe('when the location exists', () => {
        beforeEach(() => {
            fsPromise.exists.withArgs('whatever-dir').resolves(true);
            options.bundleDir = '../bundles';
            execPromise.withArgs('git pull', { cwd: 'whatever-dir' })
                .rejects(new Error('Could not pull'));
        });

        describe('when the dry-run option is specified', () => {
            beforeEach(() => {
                options.dryRun = true;
            });

            it('should not pull', async() => {
                await gitPull(cloneInstruction, options);
                expect(execPromise).to.not.have.been.called;
            });
        });

        it('should pull', async() => {
            // act
            await gitPull(cloneInstruction, options);

            // assert
            expect(execPromise).to.have.been.calledWith('git pull', { cwd: 'whatever-dir' });
        });

        it('should add the error to the result', async() => {
            // act
            expect(await gitPull(cloneInstruction, options)).to.eql({
                pullResult: 'error',
                location: 'whatever-dir',
                name: 'myRepo',
                url: 'https://whatever'
            });
        });

        it('should add the success to the result', async() => {
            // arrange
            execPromise.withArgs('git pull', { cwd: 'whatever-dir' })
                .resolves(null); // success

            // act
            var result = await gitPull(cloneInstruction, options);

            // assert
            expect(result).to.eql({
                pullResult: 'success',
                location: 'whatever-dir',
                name: 'myRepo',
                url: 'https://whatever'
            });
        });
    });
});
